import Bitcoin from 'bitcoinjs-lib'
import BitcoinFee from 'bitcoin-fee'
import { getBip32RootKey } from '/api/bip39'
import { encryptAES128CTR, decryptAES128CTR } from '/api/crypto'
import { formatCoin, limitDecimals, bigNumber } from '/api/numbers'
import {
    decryptBIP38 as _decryptBIP38,
    encryptBIP38 as _encryptBIP38
} from '/api/crypto'
import { sortBy, highest, sum, includesMultiple } from '/api/arrays'
import { resolveAll } from '/api/promises'

import {
    TYPE_COIN,
    MAINNET,
    TESTNET,
    ASSET_LOGO,
    LOCALSTORAGE_NETWORK
} from '/const/'

// network
export const networks = {
    [MAINNET]: {
        // mainnet
        network: Bitcoin.networks.bitcoin, // 0x80
        url: 'https://insight.bitcoin.com' // 'https://blockexplorer.com' // 'https://btc-bitcore4.trezor.io' // 'https://insight.bitpay.com' // "https://btc-bitcore1.trezor.io"
    },
    [TESTNET]: {
        // testnet
        network: Bitcoin.networks.testnet, // 0xef
        url: 'https://testnet-bitcore1.trezor.io' // 'https://test-insight.bitpay.com'
    }
}
let url, network, network_id, api_url
export function setupNetwork(id, networks) {
    const network_data = networks[id]
    if (typeof network_data !== 'undefined') {
        network_id = id
        network = network_data.network
        url = network_data.url
        api_url = `${url}/api` // https://github.com/bitpay/insight-api
        return true
    }
    return false
}

// exports
export const type = TYPE_COIN
export const symbol = 'BTC'
export const symbol_fee = symbol
export const name = 'Bitcoin'
export const color = '#fdb033'
export const ascii = 'Ƀ'
export const coin_decimals = 8
export const price_decimals = 0
export const satoshis = Math.pow(10, coin_decimals)
export const multiaddress = true // if true we can't change the address on the user interface we use all the address as a full balance
export const changeaddress = true // if true we change the remaining balance to the next address
export const labels = 'btc coin'
export const logo = ASSET_LOGO(symbol)
export const networks_availables = [MAINNET, TESTNET]

export const derivation_path = {
    mainnet: index => `m/44'/0'/0'/0/${index}`,
    mainnetsegwit: index => `m/49'/0'/0'/0/${index}`,
    testnet: index => `m/44'/1'/0'/0/${index}`,
    testnetsegwit: index => `m/49'/1'/0'/0/${index}`
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
    passphase = '',
    segwit = true
}) {
    return getWalletsFromSeed({
        seed,
        index,
        derived_path_function,
        passphase,
        segwit
    })[0]
}

export function getWalletsFromSeed({
    seed,
    index = 0,
    count = 1,
    derived_path_function,
    passphase = '',
    segwit = true
}) {
    if (derived_path_function === undefined)
        derived_path_function =
            network_id === MAINNET
                ? segwit
                    ? derivation_path.mainnetsegwit
                    : derivation_path.mainnet
                : segwit
                    ? derivation_path.testnetsegwit
                    : derivation_path.testnet

    const wallets = []
    const bip32RootKey = getBip32RootKey({ seed, passphase, network })
    while (count-- > 0) {
        // console.log(index, count)
        const path = derived_path_function(index++)
        const key = bip32RootKey.derivePath(path)
        const keypair = key.keyPair
        wallets.push(
            segwit
                ? getSegwitWalletFromKeyPair(key.keyPair)
                : getWalletFromKeyPair(keypair)
        )
    }

    return wallets
}

function getWalletFromKeyPair(keypair) {
    return { address: keypair.getAddress(), private_key: keypair.toWIF() }
}

function getSegwitWalletFromKeyPair(keypair) {
    const pubKey = keypair.getPublicKeyBuffer()
    const pubKeyHash = Bitcoin.crypto.hash160(pubKey)
    const redeemScript = Bitcoin.script.witnessPubKeyHash.output.encode(
        pubKeyHash
    )
    const redeemScriptHash = Bitcoin.crypto.hash160(redeemScript)
    const scriptPubKey = Bitcoin.script.scriptHash.output.encode(
        redeemScriptHash
    )
    return {
        address: Bitcoin.address.fromOutputScript(scriptPubKey, network),
        private_key: keypair.toWIF()
    }
}

export function validateAddress({ symbol, address, network }) {
    try {
        const { version } = Bitcoin.address.fromBase58Check(address)
        return network.pubKeyHash === version || network.scriptHash === version
    } catch (e) {
        return false
    }
}

export function isAddress(address) {
    return validateAddress({ symbol, address, network })
}

export function isSegwitAddress(address) {
    const { version } = Bitcoin.address.fromBase58Check(address)
    return (
        version === networks[MAINNET].network.scriptHash ||
        version === networks[TESTNET].network.scriptHash
    )
}

export function isPrivateKeyBip(private_key) {
    // https://github.com/pointbiz/bitaddress.org/blob/67e167930c4ebd9cf91047c36792c4e32dc41f11/src/ninja.key.js#L38
    return /^6P[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{56}$/.test(
        private_key
    )
}

export function isPrivateKey(private_key) {
    try {
        const address = getAddressFromPrivateKey(private_key)
        return isAddress(address)
    } catch (e) {
        return false
    }
    // return (
    //     isWalletImportFormat(private_key) ||
    //     isCompressedWalletImportFormat(private_key)
    //     // isHexFormat(private_key) ||
    //     // isBase64Format(private_key)
    // )
}

// export function isWalletImportFormat(key) {
//     key = key.toString()
//     return network === mainnet
//         ? /^5[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$/.test(
//               key
//           )
//         : /^9[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$/.test(
//               key
//           )
// }

// export function isCompressedWalletImportFormat(key) {
//     key = key.toString()
//     return network === mainnet
//         ? /^[LK][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{51}$/.test(
//               key
//           )
//         : /^c[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{51}$/.test(
//               key
//           )
// }

export function formatAddress(address) {
    return address.trim()
}

export function getAddressFromPrivateKey(private_key) {
    const wallet = Bitcoin.ECPair.fromWIF(private_key, network)
    return wallet.getAddress().toString()
}

export function getSegwitAddressFromPrivateKey(private_key) {
    const wallet = Bitcoin.ECPair.fromWIF(private_key, network)
    // wallet.compressed = false
    const ecpair = new Bitcoin.ECPair(wallet.d)
    return getSegwitAddressFromECPair(ecpair)
}

function getSegwitAddressFromECPair(ecpair) {
    const redeemScript = getRedeemScript(ecpair)
    const redeemScriptHash = Bitcoin.crypto.hash160(redeemScript)
    const scriptPubKey = Bitcoin.script.scriptHash.output.encode(
        redeemScriptHash
    )
    return Bitcoin.address.fromOutputScript(scriptPubKey, network)
}

function getRedeemScript(ecpair) {
    const pubKey = ecpair.getPublicKeyBuffer()
    const pubKeyHash = Bitcoin.crypto.hash160(pubKey)
    return Bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash)
}

// export function getAddressFromPublicKey(public_key) {
//     const publicKeyBuffer = new Buffer(public_key, 'hex')
//     const wallet = Bitcoin.ECPair.fromPublicKeyBuffer(publicKeyBuffer, network)
//     return wallet.getAddress().toString()
//     // console.log(new Bitcoin.ECPair(null, wallet.Q, { compressed: true }).getAddress())
//     // console.log(new Bitcoin.ECPair(null, wallet.Q, { compressed: false }).getAddress())
// }

// export function getAllFormats(wallet) {
//     const formats = {}
//     if (typeof wallet == 'string')
//         wallet = Bitcoin.ECPair.fromWIF(wallet, network)
//     formats.compressed = wallet.compressed
//     wallet.compressed = false
//     formats.address = wallet.getAddress()
//     formats.public_key = wallet.getPublicKeyBuffer().toString('hex')
//     formats.private_key = wallet.toWIF()
//     wallet.compressed = true
//     formats.address_comp = wallet.getAddress()
//     formats.public_key_comp = wallet.getPublicKeyBuffer().toString('hex')
//     formats.private_key_comp = wallet.toWIF()
//     return formats
// }

export function urlInfo(address) {
    return `${url}/address/${address}`
}

export function urlInfoTx(txid) {
    return `${url}/tx/${txid}`
}

export function urlDecodeTx() {
    return 'https://live.blockcypher.com/btc/decodetx/'
}

export function encryptSeed(seed, password) {
    const seed_encrypted = encryptAES128CTR(seed, password)
    // seed_encrypted.hash = sha3(seed).toString('hex')
    return seed_encrypted
}

export function decryptSeed(addresses, seed_encrypted, password) {
    const seed = decryptAES128CTR(seed_encrypted, password)
    const wallet = getWalletFromSeed({ seed })
    const wallet2 = getWalletFromSeed({ seed, segwit: false })
    if (
        addresses.includes(wallet.address) ||
        addresses.includes(wallet2.address)
    )
        return seed
}

export function encryptPrivateKey(private_key, password) {
    return encryptAES128CTR(private_key, password)
}

export function decryptPrivateKey(address, private_key_encrypted, password) {
    const private_key = decryptAES128CTR(private_key_encrypted, password)
    if (isPrivateKey(private_key)) {
        const address_frompk = isSegwitAddress(address)
            ? getSegwitAddressFromPrivateKey(private_key)
            : getAddressFromPrivateKey(private_key)
        if (address_frompk === address) return private_key
    }
}

export function decryptPrivateKeyFromSeed(
    address,
    addresses,
    seed_encrypted,
    password
) {
    const wallet = decryptWalletFromSeed(
        address,
        addresses,
        seed_encrypted,
        password
    )
    if (wallet) return wallet.private_key
}

export function getNextWalletFromSeed(
    address,
    addresses,
    seed_encrypted,
    password
) {
    const wallet = decryptWalletFromSeed(
        address,
        addresses,
        seed_encrypted,
        password
    )
    if (wallet)
        return getWalletFromSeed({
            seed: wallet.seed,
            index: wallet.index + 1,
            segwit: wallet.segwit
        })
}

// export function getPrivatekeysByAddressesFromSeed({}){

// }

export function decryptWalletFromSeed(
    address,
    addresses,
    seed_encrypted,
    password
) {
    const seed = decryptAES128CTR(seed_encrypted, password)
    for (let index = addresses.length - 1, wallet; index >= 0; index--) {
        wallet = getWalletFromSeed({ seed, index })
        if (wallet.address === address) {
            wallet.seed = seed
            wallet.index = index
            wallet.segwit = true
            return wallet
        }
        wallet = getWalletFromSeed({ seed, index, segwit: false })
        if (wallet.address === address) {
            wallet.seed = seed
            wallet.index = index
            wallet.segwit = false
            return wallet
        }
    }
}

export function encryptBIP38(private_key, password, progressCallback) {
    return _encryptBIP38(private_key, password, progressCallback)
}

export function decryptBIP38(encryptedKey, password, progressCallback) {
    return _decryptBIP38(encryptedKey, password, progressCallback, network.wif)
}

// fetchs
export function discoverAddress({ seed, index = 0, segwit = false }) {
    return new Promise(resolve => {
        const wallet = getWalletFromSeed({
            seed,
            index,
            segwit
        })
        const address = wallet.address
        fetchTotals(address).then(totals => {
            resolve({
                address,
                balance: String(totals.balance),
                totalReceived: String(totals.totalReceived)
            })
        })
    })
}

export function discoverWallet({ seed }, onDiscoverAddress) {
    return new Promise(resolve => {
        let index = 0
        let segwit = false
        const addresses = []
        const onPush = wallet => {
            if (onDiscoverAddress) onDiscoverAddress(wallet)
            addresses.push(wallet.address)
        }
        const onFetch = () => {
            discoverAddress({ seed, index, segwit }).then(wallet => {
                // console.log(seed, index, wallet)
                if (wallet.totalReceived > 0) {
                    index += 1
                    onPush(wallet)
                    onFetch()
                } else if (!segwit) {
                    index = 0
                    segwit = true
                    onFetch()
                } else {
                    if (addresses.length === 0) {
                        index += 1
                        onPush({ address: wallet.address, balance: 0 })
                    }
                    resolve({
                        address: addresses[addresses.length - 1],
                        addresses,
                        index,
                        segwit
                    })
                }
            })
        }
        onFetch()
    })
}

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
        ).toFixed()
    })
}

const cacheRecomendedFee = {}
export function fetchRecomendedFee({
    addresses,
    amount = 0,
    outputs = 1,
    use_cache = false
}) {
    const address = addresses.join(',')
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
                      return fetch(`${api_url}/addrs/${address}/utxo?noCache=1`)
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
            outputs: outputs + 1 // extra output for change_address
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

export function fetchTxs(addresses, from = 0, to = from + 25) {
    return fetch(
        `${api_url}/addrs/${addresses.join(
            ','
        )}/txs?noScriptSig=1&noAsm=1&noSpent=0&from=${from}&to=${to}`
    )
        .then(response => response.json())
        .then(json => {
            const data = {
                totalTxs: json.totalItems,
                txs: []
            }
            json.items.forEach(tx_raw => {
                const value_inputs = tx_raw.vin
                    .filter(input => addresses.includes(input.addr))
                    .reduce((v, input) => v.add(input.value), bigNumber(0))

                const value_outputs = tx_raw.vout
                    .filter(output => {
                        const pubkey = output.scriptPubKey
                        return (
                            pubkey &&
                            pubkey.addresses &&
                            includesMultiple(pubkey.addresses, addresses)
                        )
                    })
                    .reduce((v, output) => v.add(output.value), bigNumber(0))

                const tx = {
                    txid: tx_raw.txid,
                    fees: bigNumber(tx_raw.fees),
                    time: tx_raw.time,
                    confirmations: tx_raw.confirmations,
                    value: value_inputs
                        .minus(value_outputs)
                        .minus(tx_raw.fees)
                        .times(-1)

                    // raw: tx_raw,
                }

                // If is a sent we remove the fee on the calculation
                if (tx.value.gt(0)) {
                    tx.value = tx.value.minus(tx_raw.fees)
                }

                // We don't show the tx if value is 0
                if (tx.value.gt(0) || tx.value.lt(0)) {
                    tx.fees = tx.fees.toFixed()
                    tx.value = tx.value.toFixed()
                    data.txs.push(tx)
                } else {
                    data.totalTxs -= 1
                }
            })
            // console.log(JSON.stringify(data))
            return data
        })
}

function fetchTotals(address) {
    return fetch(`${api_url}/addr/${address}`)
        .then(response => response.json())
        .then(totals => totals)
}

export function createSimpleTx({
    from_addresses,
    to_address,
    private_keys,
    amount,
    fee,
    change_address
}) {
    // const from_address = getAddressFromPrivateKey(private_key)
    const last_address = from_addresses[from_addresses.length - 1]
    change_address = isAddress(change_address) ? change_address : last_address
    return fetch(`${api_url}/addrs/${from_addresses.join(',')}/utxo?noCache=1`)
        .then(response => response.json())
        .then(txs => {
            // console.log(txs)

            let totalInput = bigNumber(0)
            const totalOutput = bigNumber(amount).plus(fee)
            const txb = new Bitcoin.TransactionBuilder(network)

            // Adding inputs
            // console.log(txs)
            sortBy(txs || [], '-amount').forEach((tx, index) => {
                if (totalInput.lt(totalOutput)) {
                    txb.addInput(tx.txid, tx.vout)
                    txb.inputs[index].satoshis = tx.satoshis
                    txb.inputs[index].address = tx.address
                    totalInput = totalInput.plus(tx.amount)
                }
            })

            // Adding outputs
            // txb.addOutput(to_address, 100000000)
            txb.addOutput(to_address, toSatoshis(amount))
            const amountBack = bigNumber(totalInput)
                .minus(amount)
                .minus(bigNumber(fee))
            if (amountBack.gt(0))
                txb.addOutput(change_address, toSatoshis(amountBack))

            // signing inputs
            txb.inputs.forEach((input, index) => {
                try {
                    const is_segwit = isSegwitAddress(input.address)
                    const index_pk = from_addresses.indexOf(input.address)
                    const ecpair = Bitcoin.ECPair.fromWIF(
                        private_keys[index_pk],
                        network
                    )

                    if (is_segwit) {
                        txb.sign(
                            index,
                            ecpair,
                            getRedeemScript(ecpair),
                            null,
                            input.satoshis
                        )
                    } else {
                        txb.sign(index, ecpair)
                    }
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
    return sendProviders[network_id === MAINNET ? 'mainnet' : 'testnet']
}

const sendProviders = {
    mainnet: [
        {
            name: 'BlockCypher',
            url: `https://live.blockcypher.com/btc/pushtx/`,
            send: sendRawTxBlockcypher(
                'https://api.blockcypher.com/v1/btc/main/txs/push'
            )
        },
        {
            name: 'Bitpay.com',
            url: `${networks[MAINNET].url}/tx/send`,
            send: sendRawTxInsight(`${api_url}/tx/send`)
        }
    ],
    testnet: [
        {
            name: 'BlockCypher',
            url: `https://live.blockcypher.com/btc-testnet/pushtx/`,
            send: sendRawTxBlockcypher(
                'https://api.blockcypher.com/v1/btc/test3/txs/push'
            )
        },
        {
            name: 'Trezor.io',
            url: `${networks[TESTNET].url}/tx/send`, //'https://test-insight.bitpay.com/tx/send',
            send: sendRawTxInsight(`${api_url}/tx/send`)
        }
    ]
}

// https://en.bitcoin.it/wiki/Transaction_broadcasting
export function sendRawTxInsight(url) {
    return function(rawTx) {
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
        return fetch(url, fetchOptions)
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
}

// https://en.bitcoin.it/wiki/Transaction_broadcasting
export function sendRawTxBlockcypher(url) {
    return function(rawTx) {
        const fetchOptions = {
            method: 'POST',
            body: JSON.stringify({
                tx: rawTx
            })
        }
        return fetch(url, fetchOptions)
            .then(response => response.text())
            .then(response => {
                try {
                    return JSON.parse(response)
                } catch (e) {
                    return Promise.reject(response)
                }
            })
            .then(data => data.tx.hash)
    }
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

// const onChainNetworks = {
//     BTC: {
//         mainnet: {
//             messagePrefix: '\x18Bitcoin Signed Message:\n',
//             bip32: {
//                 public: 0x049d7cb2,
//                 private: 0x049d7878
//             },
//             pubKeyHash: 0x00,
//             scriptHash: 0x05,
//             wif: 0x80
//         },
//         testnet: {
//             messagePrefix: '\x18Bitcoin Signed Message:\n',
//             bip32: {
//                 public: 71979618,
//                 private: 71978536
//             },
//             pubKeyHash: 111,
//             scriptHash: 196,
//             wif: 239
//         }
//     },
//     LTC: {
//         mainnet: {
//             messagePrefix: '\x19Litecoin Signed Message:\n',
//             bip32: {
//                 public: 0x01b26ef6,
//                 private: 0x01b26792
//             },
//             pubKeyHash: 0x30,
//             scriptHash: 0x32,
//             wif: 0xb0
//         }
//     },
//     DOGE: {
//         messagePrefix: '\u0019Dogecoin Signed Message:\n',
//         bip32: { public: 49990397, private: 49988504 },
//         pubKeyHash: 30,
//         scriptHash: 22,
//         wif: 158
//     },
//     GRLC: {
//         //m/44'/1982'/0'/0
//         messagePrefix: '\u0019Garlicoin Signed Message:\n',
//         bip32: { public: 76067358, private: 76066276 },
//         pubKeyHash: 38,
//         scriptHash: 50,
//         wif: 176
//     }
// }
