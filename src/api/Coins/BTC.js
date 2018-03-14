import Bitcoin from 'bitcoinjs-lib'
import BitcoinFee from 'bitcoin-fee'
import { sha3 } from 'ethereumjs-util'
import { getBip32RootKey } from '/api/bip39'
import { encryptAES128CTR, decryptAES128CTR } from '/api/crypto'
import { formatCoin, limitDecimals, bigNumber } from '/api/numbers'
import {
    decryptBIP38 as _decryptBIP38,
    encryptBIP38 as _encryptBIP38
} from '/api/crypto'
import { sortBy, highest, sum } from '/api/arrays'
import { localStorageGet } from '/api/browser'
import { resolveAll } from '/api/promises'

import {
    TYPE_COIN,
    MAINNET,
    TESTNET,
    ASSET_LOGO,
    LOCALSTORAGE_NETWORK
} from '/const/'

// private
const network_int = Number(localStorageGet(LOCALSTORAGE_NETWORK)) || MAINNET
const mainnet = Bitcoin.networks.bitcoin // 0x80
const testnet = Bitcoin.networks.testnet // 0xef
const network = network_int === MAINNET ? mainnet : testnet
const url =
    network === mainnet
        ? 'https://insight.bitpay.com'
        : 'https://test-insight.bitpay.com'
const api_url = `${url}/api` // https://github.com/bitpay/insight-api

// exports
export const type = TYPE_COIN
export const symbol = 'BTC'
export const symbol_fee = symbol
export const name = 'Bitcoin'
export const color = '#fdb033'
export const ascii = 'Ƀ'
export const coin_decimals = 8
export const price_decimals = 0
export const satoshis = 100000000
export const labels = 'btc coin'
export const logo = ASSET_LOGO(symbol)

export const derivation_path = {
    mainnet: index => `m/44'/0'/0'/0/${index}`,
    testnet: index => `m/44'/1'/0'/0/${index}`
}

export function format(value, decimals = coin_decimals) {
    return formatCoin(value, decimals, symbol)
}

export function cutDecimals(value) {
    return limitDecimals(value, coin_decimals)
}

export function toSatoshis(value) {
    return Math.round(Number(bigNumber(value).times(satoshis)))
    // return
    // Number(
    //     bigNumber(amount.toFixed(8))
    //         .times(satoshis)
    //         .toString()
    // )
}

export function getWalletFromSeed({
    seed,
    index = 0,
    derived_path_function,
    passphase = ''
}) {
    return getWalletsFromSeed({
        seed,
        index,
        derived_path_function,
        passphase
    })[0]
}

export function getWalletsFromSeed({
    seed,
    index = 0,
    count = 1,
    derived_path_function,
    passphase = ''
}) {
    if (derived_path_function === undefined)
        derived_path_function =
            network_int === MAINNET
                ? derivation_path.mainnet
                : derivation_path.testnet

    const wallets = []
    const bip32RootKey = getBip32RootKey({ seed, passphase, network })
    while (count-- > 0) {
        // console.log(index, count)
        let path = derived_path_function(index++)
        let key = bip32RootKey.derivePath(path)
        let wallet = key.keyPair
        wallets.push({
            address: wallet.getAddress(),
            private_key: wallet.toWIF()
        })
    }

    return wallets
}

// export function generateRandomWallet() {
//     const wallet = Bitcoin.ECPair.makeRandom({ network: network })
//     wallet.compressed = false
//     return { address: wallet.getAddress(), private_key: wallet.toWIF() }
// }

// https://en.bitcoin.it/wiki/List_of_address_prefixes
export function isAddress(address) {
    return network === mainnet
        ? /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)
        : /^[mn][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)
}

export function isAddressCheck(address) {
    try {
        Bitcoin.address.fromBase58Check(address)
    } catch (e) {
        // console.error(e)
        return false
    }
    return true
}

// export function isPublicKey(public_key) {
//     return /^([0-9a-fA-F]{66}|[0-9a-fA-F]{130})$/.test(public_key)
// }

export function isPrivateKey(private_key) {
    return (
        isWalletImportFormat(private_key) ||
        isCompressedWalletImportFormat(private_key)
        // isHexFormat(private_key) ||
        // isBase64Format(private_key)
    )
}

export function isPrivateKeyBip(private_key) {
    // https://github.com/pointbiz/bitaddress.org/blob/67e167930c4ebd9cf91047c36792c4e32dc41f11/src/ninja.key.js#L38
    return /^6P[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{56}$/.test(
        private_key
    )
}

export function isWalletImportFormat(key) {
    key = key.toString()
    return network === mainnet
        ? /^5[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$/.test(
              key
          )
        : /^9[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$/.test(
              key
          )
}

export function isCompressedWalletImportFormat(key) {
    key = key.toString()
    return network === mainnet
        ? /^[LK][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{51}$/.test(
              key
          )
        : /^c[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{51}$/.test(
              key
          )
}

export function formatAddress(address) {
    return address.trim()
}

export function getAddressFromPrivateKey(private_key) {
    const wallet = Bitcoin.ECPair.fromWIF(private_key, network)
    return wallet.getAddress().toString()
}

// export function getAddressFromPublicKey(public_key) {
//     const publicKeyBuffer = new Buffer(public_key, 'hex')
//     const wallet = Bitcoin.ECPair.fromPublicKeyBuffer(publicKeyBuffer, network)
//     return wallet.getAddress().toString()
//     // console.log(new Bitcoin.ECPair(null, wallet.Q, { compressed: true }).getAddress())
//     // console.log(new Bitcoin.ECPair(null, wallet.Q, { compressed: false }).getAddress())
// }

export function getAllFormats(wallet) {
    const formats = {}
    if (typeof wallet == 'string')
        wallet = Bitcoin.ECPair.fromWIF(wallet, network)
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

export function urlInfo(address) {
    return `${url}/address/${address}`
}

export function urlInfoTx(txid) {
    return `${url}/tx/${txid}`
}

export function urlDecodeTx() {
    return 'https://live.blockcypher.com/btc/decodetx/'
}

export function encryptPrivateKey(private_key, password) {
    return encryptAES128CTR(private_key, password)
}

export function decryptPrivateKey(address, private_key_encrypted, password) {
    const private_key = decryptAES128CTR(private_key_encrypted, password)
    if (isPrivateKey(private_key))
        if (getAddressFromPrivateKey(private_key) === address)
            return private_key
}

export function encryptSeed(seed, password) {
    const seed_encrypted = encryptAES128CTR(seed, password)
    seed_encrypted.hash = sha3(seed).toString('hex')
    return seed_encrypted
}

export function decryptSeed(address, seed_encrypted, password) {
    const { seed } = decryptPrivateKeyFromSeed(
        address,
        seed_encrypted,
        password
    )
    return seed
}

export function decryptPrivateKeyFromSeed(address, seed_encrypted, password) {
    const seed = decryptAES128CTR(seed_encrypted, password)
    const wallet = getWalletFromSeed({ seed })
    return wallet.address === address
        ? { private_key: wallet.private_key, seed }
        : {}
}

export function encryptBIP38(privateKey, password, progressCallback) {
    return _encryptBIP38(privateKey, password, progressCallback)
}

export function decryptBIP38(encryptedKey, password, progressCallback) {
    return _decryptBIP38(encryptedKey, password, progressCallback, network.wif)
}

// fetchs
export function fetchBalance(address) {
    // return fetch(`${api_url}/addr/${address}/balance`)
    //     .then(response => response.text())
    //     .then(balance => {
    //         // return Number(balance) / satoshis
    //         return bigNumber(balance).div(satoshis).toString()
    //     })
    return fetchTotals(address).then(data => {
        return bigNumber(
            data.unconfirmedBalance < 0
                ? data.balance + data.unconfirmedBalance
                : data.balance
        ).toString()
    })
}

const cacheRecomendedFee = {}
export function fetchRecomendedFee({
    address,
    amount = 0,
    outputs = 1,
    use_cache = false
}) {
    const cache = cacheRecomendedFee[address]
    const first_time =
        cache === undefined ||
        cache.fee_per_kb === undefined ||
        cache.inputs === undefined

    const promise =
        first_time || !use_cache
            ? fetchFees()
                  .catch(e =>
                      Promise.reject(
                          "BTC.fetchRecomendedFee: We couldn't fetch fee prices"
                      )
                  )
                  .then(fee => {
                      cacheRecomendedFee[address] = { fee_per_kb: fee }
                      return fetch(`${api_url}/addr/${address}/utxo?noCache=1`)
                  })
                  .then(response => response.json())
                  .catch(e =>
                      Promise.reject(
                          "BTC.fetchRecomendedFee: We couldn't fetch utxo"
                      )
                  )
                  .then(utxo => {
                      const inputs = sortBy(utxo || [], '-amount').map(
                          input => input.amount
                      )
                      return (cacheRecomendedFee[address].inputs = inputs)
                  })
            : Promise.resolve()

    return promise.then(() => {
        const address_data = cacheRecomendedFee[address]
        const inputs = address_data.inputs || []
        const data = {
            amount: amount || 0,
            fee_per_kb: address_data.fee_per_kb,
            inputs: inputs,
            outputs: outputs + 1 // extra output for changeAddress
        }
        // console.log(data)
        return calcFee(data)
    })
}
function fetchFees() {
    const promises = BitcoinFee.SERVICES.map(service =>
        BitcoinFee.fetchFee(service)
    )
    return resolveAll(promises).then(
        fees => (fees.length > 0 ? highest(fees) : Promise.reject(null))
    )
}
function calcFee({ fee_per_kb, amount, inputs, outputs, extra_bytes = 0 }) {
    let amount_sum = 0
    let index = 0
    let inputs_total = 0
    for (; index < inputs.length && amount_sum < amount; ++index) {
        amount_sum += inputs[index]
        inputs_total += 1
    }

    return cutDecimals(
        bigNumber(10 + inputs_total * 148 + outputs * 34 + extra_bytes)
            .times(fee_per_kb)
            .div(satoshis)
            .toFixed()
    )
}

// export function fetchRecomendedFee() {
//     // https://btc-bitcore1.trezor.io/api/utils/estimatefee
//     // https://bitcoinfees.21.co/api/v1/fees/recommended
//     // https://www.bitgo.com/api/v1/tx/fee
//     return fetch(`https://insight.bitpay.com/api/utils/estimatefee`)
//         .then(response => response.json())
//         .then(fees => fees[2])
// }

export function fetchTxs(address, from = 0, to = from + 25) {
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
                let value = bigNumber(0)
                let tx = {
                    txid: txRaw.txid,
                    fees: bigNumber(txRaw.fees),
                    time: txRaw.time,
                    confirmations: txRaw.confirmations,
                    value: bigNumber(0)
                    // raw: txRaw,
                }

                for (
                    index = 0, total = txRaw.vin.length;
                    index < total;
                    ++index
                ) {
                    if (txRaw.vin[index].addr === address) {
                        tx.value = tx.value.minus(txRaw.vin[index].value)
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
                        tx.value = tx.value.add(txRaw.vout[index].value)
                        // break // maybe
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
            totals.balance =
                data.unconfirmedBalance < 0
                    ? data.balance + data.unconfirmedBalance
                    : data.balance
            totals.totalReceived = data.totalReceived
            totals.totalSent = data.totalSent
            totals.unconfirmedBalance = data.unconfirmedBalance
            return fetchTxs(address)
        })
        .then(txs => Object.assign(txs, totals))
}

export function fetchTotals(address) {
    return fetch(`${api_url}/addr/${address}`)
        .then(response => response.json())
        .then(totals => totals)
}

export function createSimpleTx({
    private_key,
    toAddress,
    amount,
    fee,
    changeAddress
}) {
    const fromAddress = getAddressFromPrivateKey(private_key)
    changeAddress = isAddressCheck(changeAddress) ? changeAddress : fromAddress
    return fetch(`${api_url}/addr/${fromAddress}/utxo?noCache=1`)
        .then(response => response.json())
        .then(txs => {
            // console.log(txs)

            let totalInput = bigNumber(0)
            const totalOutput = bigNumber(amount).plus(fee)
            const txb = new Bitcoin.TransactionBuilder(network)
            const private_key_ecpar = Bitcoin.ECPair.fromWIF(
                private_key,
                network
            )

            // Adding inputs
            // console.log(txs)
            sortBy(txs || [], '-amount').forEach(tx => {
                if (totalInput.lt(totalOutput)) {
                    txb.addInput(tx.txid, tx.vout)
                    totalInput = totalInput.plus(tx.amount)
                }
            })

            // Adding outputs
            // txb.addOutput(toAddress, 100000000)
            txb.addOutput(toAddress, toSatoshis(amount))
            const amountBack = bigNumber(totalInput)
                .minus(amount)
                .minus(bigNumber(fee))
            if (amountBack.gt(0))
                txb.addOutput(changeAddress, toSatoshis(amountBack))

            // signing inputs
            txb.inputs.forEach((input, index) => {
                try {
                    txb.sign(index, private_key_ecpar)
                } catch (e) {
                    console.error(e)
                }
            })

            console.log(txb.inputs)

            const txHex = txb.build().toHex()
            return txHex
            // let a = new TxDecoder(txHex, network) // https://github.com/you21979/node-multisig-wallet/blob/master/lib/txdecoder.js
            // console.log(a.decode())
        })
}

export function getSendProviders() {
    return sendProviders[network === mainnet ? 'mainnet' : 'testnet']
}

const sendProviders = {
    mainnet: [
        {
            name: 'Bitpay.com',
            url: 'https://insight.bitpay.com/tx/send',
            send: sendRawTxBitpay
        }
    ],
    testnet: [
        {
            name: 'Bitpay.com',
            url: 'https://test-insight.bitpay.com/tx/send',
            send: sendRawTxBitpay
        }
    ]
}

// https://en.bitcoin.it/wiki/Transaction_broadcasting
function sendRawTxBitpay(rawTx) {
    const fetchOptions = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rawtx: rawTx
        })
    }
    return fetch(`${api_url}/tx/send`, fetchOptions)
        .then(response => response.text())
        .then(response => {
            try {
                return JSON.parse(response)
            } catch (e) {
                return Promise.reject(response)
            }
        })
        .then(data => data.txid)
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
    bytes.unshift(network); // prepend 0x80 byte
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
