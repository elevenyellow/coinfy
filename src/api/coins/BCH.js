import Bitcoin from 'bitcoinjs-lib'
import { getBip32RootKey } from '/api/bip39'
import { encryptAES128CTR, decryptAES128CTR } from '/api/crypto'
import { formatCoin, limitDecimals, bigNumber } from '/api/numbers'
import {
    decryptBIP38 as _decryptBIP38,
    encryptBIP38 as _encryptBIP38
} from '/api/crypto'
import { sortBy, highest, sum, includesMultiple } from '/api/arrays'
import { resolveAll } from '/api/promises'

import { validateAddress } from '/api/coins/BTC'

import {
    TYPE_COIN,
    MAINNET,
    TESTNET,
    ASSET_LOGO,
    LOCALSTORAGE_NETWORK
} from '/const/'

export const networks = {
    [MAINNET]: {
        network: Bitcoin.networks.bitcoin,
        url: 'https://bch.blockdozer.com'
    },
    [TESTNET]: {
        network: Bitcoin.networks.testnet,
        url: 'https://tbch.blockdozer.com'
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
export const symbol = 'BCH'
export const symbol_fee = symbol
export const name = 'Bitcoin Cash'
export const color = '#99c361'
export const ascii = 'Ƀ'
export const coin_decimals = 8
export const price_decimals = 0
export const satoshis = Math.pow(10, coin_decimals)
export const multiaddress = true // if true we can't change the address on the user interface we use all the address as a full balance
export const changeaddress = true // if true we change the remaining balance to the next address
export const labels = 'bch coin'
export const logo = ASSET_LOGO(symbol)

export const derivation_path = {
    mainnet: index => `m/44'/145'/0'/0/${index}`,
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
            network_id === MAINNET
                ? derivation_path.mainnet
                : derivation_path.testnet

    const wallets = []
    const bip32RootKey = getBip32RootKey({ seed, passphase, network })
    while (count-- > 0) {
        // console.log(index, count)
        const path = derived_path_function(index++)
        const key = bip32RootKey.derivePath(path)
        const keypair = key.keyPair
        wallets.push(getWalletFromKeyPair(keypair))
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

// https://github.com/bitcoincashorg/bitcoincash.org/blob/master/spec/cashaddr.md
// https://github.com/schancel/cashaddr-converter
// https://github.com/bitcoincashjs/cashaddrjs
export function isAddress(address) {
    return validateAddress({ symbol, address, network })
}

export function isSegwitAddress(address) {
    return false
}

export function isPrivateKey(private_key) {
    try {
        const address = getAddressFromPrivateKey(private_key)
        return isAddress(address)
    } catch (e) {
        return false
    }
}

export function isPrivateKeyBip(private_key) {
    return /^6P[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{56}$/.test(
        private_key
    )
}

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
            index: wallet.index + 1
        })
}

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
            return wallet
        }
    }
}

export function decryptSeed(addresses, seed_encrypted, password) {
    const seed = decryptAES128CTR(seed_encrypted, password)
    const wallet = getWalletFromSeed({ seed })
    if (addresses.includes(wallet.address)) return seed
}

export function encryptBIP38(privateKey, password, progressCallback) {
    return _encryptBIP38(privateKey, password, progressCallback)
}

export function decryptBIP38(encryptedKey, password, progressCallback) {
    return _decryptBIP38(encryptedKey, password, progressCallback, network.wif)
}

// fetchs
export function discoverAddress({ seed, index = 0 }) {
    return new Promise(resolve => {
        const wallet = getWalletFromSeed({
            seed,
            index
        })
        const address = wallet.address
        fetchTotals(address).then(totals => {
            resolve({
                address,
                balance: totals.balance,
                totalReceived: totals.totalReceived
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
        ).toString()
    })
}

export function fetchRecomendedFee() {
    return fetchFees()
}
// https://ltc-bitcore1.trezor.io/api/utils/estimatefee
function fetchFees() {
    return fetch(`${api_url}/utils/estimatefee`)
        .then(response => response.json())
        .then(json => json[2])
}

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
        })
}

export function getSendProviders() {
    return sendProviders[network_id === MAINNET ? 'mainnet' : 'testnet']
}

const sendProviders = {
    mainnet: [
        {
            name: 'Blockdozer.com',
            url: `${networks[MAINNET].url}/tx/send`,
            send: sendRawTxInsight
        }
    ],
    testnet: [
        {
            name: 'Blockdozer.com',
            url: `${networks[TESTNET].url}/tx/send`,
            send: sendRawTxInsight
        }
    ]
}

function sendRawTxInsight(rawTx) {
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
