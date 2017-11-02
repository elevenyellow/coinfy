import Bitcoin from 'bitcoinjs-lib'
import Big from 'big.js'
import { decryptAES128CTR } from '/api/security'

// private
const privateKeyPrefix = 0x80 // mainnet 0x80    testnet 0xEF
const api_url = 'https://insight.bitpay.com/api' // https://github.com/bitpay/insight-api

// exports
export const type = 'wallet'
export const symbol = 'BTC'
export const name = 'Bitcoin'
export const color = '#fdb033'
export const ascii = 'Ƀ'
export const price_decimals = 0
export const satoshis = 100000000

export function format(value) {
    const tof = typeof value
    if (tof != 'number' && tof != 'string') value = '0'
    return `${value} ${symbol}`
}

export function generateRandomWallet() {
    const wallet = Bitcoin.ECPair.makeRandom()
    wallet.compressed = false
    return { address: wallet.getAddress(), private_key: wallet.toWIF() }
}

export function isAddress(address) {
    return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)
}

export function isAddressCheck(address) {
    try {
        Bitcoin.address.fromBase58Check(address)
        
    } catch(e) {
        return false
    }

    return true
}

export function isPublicKey(public_key) {
    return /^([0-9a-fA-F]{66}|[0-9a-fA-F]{130})$/.test(public_key)
}

export function isPrivateKey(private_key) {
    return (
        isWalletImportFormat(private_key) ||
        isCompressedWalletImportFormat(private_key)
        // isHexFormat(private_key) ||
        // isBase64Format(private_key)
    )
}

export function isPrivateKeyBip(private_key) { // https://github.com/pointbiz/bitaddress.org/blob/67e167930c4ebd9cf91047c36792c4e32dc41f11/src/ninja.key.js#L38
    return (/^6P[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{56}$/.test(private_key))
}

export function isWalletImportFormat(key, prefix=0x80) {
    key = key.toString()
    return privateKeyPrefix == prefix
        ? /^5[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$/.test(
              key
          )
        : /^9[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$/.test(
              key
          )
}

export function isCompressedWalletImportFormat(key) {
    key = key.toString()
    return privateKeyPrefix == 0x80
        ? /^[LK][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{51}$/.test(
              key
          )
        : /^c[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{51}$/.test(
              key
          )
}

export function getAddressFromPrivateKey(private_key) {
    const wallet = Bitcoin.ECPair.fromWIF(private_key)
    return wallet.getAddress().toString()
}

export function getAddressFromPublicKey(public_key) {
    const publicKeyBuffer = new Buffer(public_key, 'hex')
    const wallet = Bitcoin.ECPair.fromPublicKeyBuffer(publicKeyBuffer)
    return wallet.getAddress().toString()
    // console.log(new Bitcoin.ECPair(null, wallet.Q, { compressed: true }).getAddress())
    // console.log(new Bitcoin.ECPair(null, wallet.Q, { compressed: false }).getAddress())
}

export function getAllFormats(wallet) {
    const formats = {}
    if (typeof wallet == 'string') wallet = Bitcoin.ECPair.fromWIF(wallet)
    formats.compressed = wallet.compressed
    wallet.compressed = false
    formats.address = wallet.getAddress()
    formats.public_key = wallet.getPublicKeyBuffer().toString('hex')
    formats.private_key = wallet.toWIF()
    wallet.compressed = true
    formats.address_comp = wallet.getAddress()
    formats.public_key_comp = wallet.getPublicKeyBuffer().toString('hex')
    formats.private_key_comp = wallet.toWIF()
    return formats
}

export function unlock(address, private_key_encrypted, password) {
    const private_key = decryptAES128CTR(private_key_encrypted, password)

    if (isPrivateKey(private_key)) {
        if (getAddressFromPrivateKey(private_key) === address)
            return private_key
    }

    return false
}

// fetchs
export function fetchBalance(address) {
    return fetch(`${api_url}/addr/${address}/balance`)
        .then(response => response.text())
        .then(balance => {
            return Number(balance) / satoshis
        })
}

export function fetchTotals(address, from = 0, to = 25) {
    return fetch(`${api_url}/addr/${address}`)
        .then(response => response.json())
        .then(totals => totals)
}

export function fetchTxs(address, from=0, to=from+25) {
    return fetch(
        `${api_url}/addrs/${address}/txs?noScriptSig=1&noAsm=1&noSpent=0&from=${from}&to=${to}`
    )
        .then(response => response.json())
        .then(json => {
            const data = {
                totalTxs: json.totalItems,
                txs: []
            }
            json.items.forEach(txRaw => {
                let index, total
                let tx = {
                    txid: txRaw.txid,
                    fees: Big(txRaw.fees),
                    time: txRaw.time,
                    confirmations: txRaw.confirmations
                    // raw: txRaw,
                }

                for (
                    index = 0, total = txRaw.vin.length;
                    index < total;
                    ++index
                ) {
                    if (txRaw.vin[index].addr === address) {
                        tx.value = Big(txRaw.vin[index].value).times(-1)
                        break
                    }
                }

                for (
                    index = 0, total = txRaw.vout.length;
                    index < total;
                    ++index
                ) {
                    if (
                        txRaw.vout[index].scriptPubKey &&
                        txRaw.vout[index].scriptPubKey.addresses &&
                        txRaw.vout[index].scriptPubKey.addresses.indexOf(
                            address
                        ) > -1
                    ) {
                        tx.value = Big(txRaw.vout[index].value)
                        break
                    }
                }

                // console.log(txRaw)
                data.txs.push(tx)
            })
            // console.log( json )
            return data
        })
}

export function fetchSummary(address) {
    const totals = {}
    return fetchTotals(address)
        .then(data => {
            totals.balance = data.balance
            totals.totalReceived = data.totalReceived
            totals.totalSent = data.totalSent
            totals.unconfirmedBalance = data.unconfirmedBalance
            return fetchTxs(address)
        })
        .then(txs => Object.assign(txs, totals))
}

/*
// To allow: https://www.bitaddress.org
Private Key Hexadecimal Format (64 characters [0-9A-F]):
Private Key Base64 (44 characters):


export function isHexFormat(key) {
    key = key.toString();
    return /^[A-Fa-f0-9]{64}$/.test(key);
}


export function isBase64Format(key) {
    key = key.toString();
    return (/^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=+\/]{44}$/.test(key));
}



function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

function base64ToBytes(base64) {
    // Remove non-base-64 characters
    var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

    for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
        (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
    }

    return bytes;
}


function getBitcoinWalletImportFormat(bytes) {
    if (bytes == null) return "";
    bytes.unshift(privateKeyPrefix); // prepend 0x80 byte
    var checksum = Crypto.SHA256(Crypto.SHA256(bytes, { asBytes: true }), { asBytes: true });
    bytes = bytes.concat(checksum.slice(0, 4));
    var privWif = Bitcoin.Base58.encode(bytes);
    return privWif;
};

function getBitcoinPrivateKeyByteArray(priv) {
    if (priv == null) return null;
    // Get a copy of private key as a byte array
    var bytes = priv.toByteArrayUnsigned();
    // zero pad if private key is less than 32 bytes 
    while (bytes.length < 32) bytes.unshift(0x00);
    return bytes;
};
*/
