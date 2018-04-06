import {
    addHexPrefix,
    isValidAddress,
    isValidPrivate,
    privateToAddress,
    privateToPublic,
    sha3
} from 'ethereumjs-util'
import EthereumTx from 'ethereumjs-tx'
import { getBip32RootKey } from '/api/bip39'
import { formatCoin, limitDecimals, bigNumber } from '/api/numbers'
import { decToHex, hexToDec, sanitizeHex, removeHexPrefix } from '/api/hex'
import { padLeft } from '/api/strings'
import { encryptAES128CTR, decryptAES128CTR, randomBytes } from '/api/crypto'
import { localStorageGet } from '/api/browser'
import {
    TYPE_COIN,
    MAINNET,
    TESTNET,
    ASSET_LOGO,
    LOCALSTORAGE_NETWORK
} from '/const/'

// private
export const network = Number(localStorageGet(LOCALSTORAGE_NETWORK)) || MAINNET
export const api_key = 'GY9KKYEJF1HDEPIAIRGA66R2RIQWQXV9UZ'
export const api_url =
    network === MAINNET
        ? 'https://api.etherscan.io/api'
        : 'https://ropsten.etherscan.io/api'
export const url =
    network === MAINNET
        ? 'https://etherscan.io'
        : 'https://ropsten.etherscan.io'
export const url_myetherapi =
    network === MAINNET
        ? 'https://api.myetherapi.com/eth'
        : 'https://api.myetherapi.com/rop'

// exports
export const type = TYPE_COIN
export const symbol = 'ETH'
export const symbol_fee = symbol
export const name = 'Ethereum'
export const color = '#7a8aec' //'#9c86fe'
export const ascii = ''
export const coin_decimals = 18
export const price_decimals = 0
export const satoshis = Math.pow(10, coin_decimals)
export const default_gas_limit = 21000
export const labels = 'eth coin etereum'
export const logo = ASSET_LOGO(symbol)

export { addHexPrefix } from 'ethereumjs-util'

export const derivation_path = {
    mainnet: (index = 0) => `m/44'/60'/0'/0/${index}`,
    testnet: (index = 0) => `m/44'/60'/0'/0/${index}`
}

export function format(value, decimals = coin_decimals) {
    return formatCoin(value, decimals, symbol)
}

export function cutDecimals(value) {
    return limitDecimals(value, coin_decimals)
}

export function isAddress(string) {
    return /^(0x)?[0-9a-fA-F]{40}$/.test(string)
}

export function isAddressCheck(string) {
    return isValidAddress(string)
}

export function isPrivateKey(string) {
    return /^([0-9a-fA-F]{64}|[0-9a-fA-F]{66}|[0-9a-fA-F]{128}|[0-9a-fA-F]{13})$/.test(
        string
    )
}

export function isPrivateKeyCheck(string) {
    return isValidPrivate(stringToBuffer(string))
}

export function formatAddress(address) {
    return addHexPrefix(address)
}

export function getAddressFromPrivateKey(private_key) {
    return addHexPrefix(
        privateToAddress(stringToBuffer(private_key)).toString('hex')
    )
}

export function getPublicFromPrivateKey(private_key) {
    return privateToPublic(stringToBuffer(private_key)).toString('hex')
}

export function stringToBuffer(string) {
    return new Buffer(string, 'hex')
}

export function getWalletFromSeed({
    seed,
    index = 0,
    derived_path_function,
    passphase = ''
}) {
    return getWalletsFromSeed({
        index,
        seed,
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
        derived_path_function = derivation_path.mainnet

    const wallets = []
    const bip32RootKey = getBip32RootKey({ seed, passphase })
    while (count-- > 0) {
        // console.log(index, count)
        let path = derived_path_function(index++)
        let key = bip32RootKey.derivePath(path)
        let wallet = key.keyPair.d.toBuffer()
        wallets.push({
            address: addHexPrefix(privateToAddress(wallet).toString('hex')),
            private_key: wallet.toString('hex')
        })
    }

    return wallets
}

// export function generateRandomWallet() {
//     const bytes = randomBytes(32)
//     const private_key = new Buffer(bytes, 'hex')
//     const address = privateToAddress(private_key)
//     return {
//         address: addHexPrefix(address.toString('hex')),
//         private_key: private_key.toString('hex')
//     }
// }

export function urlInfo(address) {
    return `${url}/address/${address}`
}

export function urlInfoTx(txid) {
    return `${url}/tx/${txid}`
}

export function urlDecodeTx() {
    return ''
}

export function fetchBalance(address, contract_address, _satoshis = satoshis) {
    return fetch(
        contract_address === undefined
            ? `${api_url}?apikey=${api_key}&module=account&action=balance&address=${address}&tag=latest`
            : `${api_url}?apikey=${api_key}&module=account&action=tokenbalance&address=${address}&contractaddress=${contract_address}&tag=latest`
    )
        .then(response => response.json())
        .then(response => {
            const n = bigNumber(response.result).div(_satoshis)
            return n.isNaN() ? '0' : n.toString()
        })
}

const txs_cache = {}
export function fetchTxs(
    address,
    from = 0,
    to = from + 100,
    contract_address,
    _satoshis = satoshis
) {
    const resolver =
        from > 0 && txs_cache[address] !== undefined
            ? Promise.resolve(txs_cache[address])
            : fetch(
                  `${api_url}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${api_key}`
              ).then(response => response.json())

    return resolver.then(json => {
        txs_cache[address] = json

        const raw_txs = json.result.filter(tx => tx.value > 0)
        const data = {
            totalTxs: raw_txs.length,
            txs: []
        }

        raw_txs.forEach(txRaw => {
            let tx = {
                txid: txRaw.hash,
                fees: bigNumber(txRaw.gasUsed),
                time: txRaw.timeStamp,
                confirmations: txRaw.confirmations,
                value: bigNumber(txRaw.value)
                    .div(_satoshis)
                    .toString()
                // raw: txRaw,
            }
            if (txRaw.from.toLowerCase() === address.toLowerCase())
                tx.value = '-' + tx.value

            data.txs.push(tx)
        })
        return data
    })
    // }
}

export function fetchSummary(address, contract_address, _satoshis = satoshis) {
    const totals = {}
    return fetchBalance(address, contract_address, _satoshis)
        .then(balance => {
            totals.balance = balance
            return fetchTxs(
                address,
                undefined,
                undefined,
                contract_address,
                _satoshis
            )
        })
        .then(txs => Object.assign(txs, totals))
}

// http://ipfs.b9lab.com:8080/ipfs/QmTHdYEYiJPmbkcth3mQvEQQgEamFypLhc9zapsBatQW7Y/throttled_faucet.html

const cacheRecomendedFee = {}
export function fetchRecomendedFee({
    gas_limit = default_gas_limit,
    use_cache = false
}) {
    const first_time = cacheRecomendedFee[default_gas_limit] === undefined
    return first_time || !use_cache
        ? // return JSONRpc(url_myetherapi, 'eth_gasPrice')
          fetch(`${api_url}?module=proxy&action=eth_gasPrice&apikey=${api_key}`)
              .then(response => response.json())
              .then(
                  e =>
                      (cacheRecomendedFee[default_gas_limit] = cutDecimals(
                          bigNumber(hexToDec(e.result))
                              .times(gas_limit)
                              .div(satoshis)
                              .toFixed()
                      ))
              )
        : Promise.resolve(cacheRecomendedFee[default_gas_limit])
}

// https://tokenstandard.codetract.io/
// getDataContractMethodCall('balanceOf(address)', '0xf9e4f0c2917d29753eca437f94b2997e597f3510')
export function getDataContractMethodCall(method_name) {
    let args = Array.prototype.slice.call(arguments, 1)
    let data = addHexPrefix(
        sha3(method_name)
            .toString('hex')
            .slice(0, 8)
    )

    data = data + args.map(arg => padLeft(removeHexPrefix(arg), 64)).join('')
    return data
}

export function createSimpleTx({
    private_key,
    toAddress,
    amount,
    fee,
    gas_limit = default_gas_limit,
    data
}) {
    const fromAddress = getAddressFromPrivateKey(private_key)
    // return JSONRpc(url_myetherapi, 'eth_getTransactionCount', [
    //     fromAddress,
    //     'pending'
    // ])
    return fetch(
        `${api_url}?module=proxy&action=eth_getTransactionCount&tag=latest&address=${fromAddress}&apikey=${api_key}`
    )
        .then(response => response.json())
        .then(e => {
            // console.log('fee', fee.toString())
            // console.log('last_gas_price', last_gas_price.toString())
            // console.log('gas_limit', gas_limit.toString())
            // const gas_limit = bigNumber(fee)
            //     .div(last_gas_price.div(satoshis))
            //     .toString()
            // console.log(
            //     'gas_price',
            //     fee
            //         .times(satoshis)
            //         .div(gas_limit)
            //         .toString()
            // )
            // console.log('gas_limit', gas_limit.toString())

            const txJson = {
                gasLimit: sanitizeHex(decToHex(gas_limit)),
                gasPrice: sanitizeHex(
                    decToHex(
                        fee
                            .times(satoshis)
                            .div(gas_limit)
                            .round()
                    )
                ),
                // gasPrice: '0x04a817c800',
                // gasLimit: '0x016f2e',
                nonce: sanitizeHex(e.result),
                to: sanitizeHex(toAddress),
                value: sanitizeHex(decToHex(amount.times(satoshis).round()))
            }

            if (typeof data == 'string') txJson.data = data

            console.log(txJson)
            const tx = new EthereumTx(txJson)
            tx.sign(Buffer.from(private_key, 'hex'))
            return sanitizeHex(tx.serialize().toString('hex'))
        })
}

export function encryptPrivateKey(private_key, password) {
    return encryptAES128CTR(private_key, password, true, true)
}

export function decryptPrivateKey(address, private_key_encrypted, password) {
    const private_key = decryptAES128CTR(private_key_encrypted, password, true)
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

export function getSendProviders() {
    return sendProviders[network === MAINNET ? 'mainnet' : 'testnet']
}

const sendProviders = {
    mainnet: [
        {
            name: 'Etherscan',
            url: 'https://etherscan.io/pushTx',
            send: sendRawEtherscan
        }
    ],
    testnet: [
        {
            name: 'Etherscan',
            url: 'https://ropsten.etherscan.io/pushTx',
            send: sendRawEtherscan
        }
    ]
}

export function sendRawEtherscan(rawTx) {
    // return JSONRpc(url_myetherapi, 'eth_gasPrice')
    return fetch(
        `${api_url}?module=proxy&action=eth_sendRawTransaction&hex=${rawTx}&apikey=${api_key}`
        // { method: 'POST', body: rawTx }
    )
        .then(response => response.json())
        .then(e => {
            if (e.error !== undefined)
                return Promise.reject(JSON.stringify(e.error))
            return e.result
        })
}

// function fetchMyEtherScan(extraBody) {
//     const body = {
//         apikey: 'GY9KKYEJF1HDEPIAIRGA66R2RIQWQXV9UZ',
//         module: 'account',
//         action: 'balance',
//         address: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
//         tag: 'latest',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//         }
//     }
//     var query = Object.keys(body)
//         .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(body[k]))
//         .join('&')
//     return fetch('https://api.etherscan.io/api', {
//         method: 'POST',
//         body: query
//     }).then(response => response.json())
// }

// https://ethereum.stackexchange.com/questions/1374/how-can-i-check-if-an-ethereum-address-is-valid
// export function isChecksumAddress(address) {
//     // Check each case
//     address = address.replace('0x','');
//     var addressHash = sha3(address.toLowerCase());
//     for (var i = 0; i < 40; i++ ) {
//         // the nth letter should be uppercase if the nth digit of casemap is 1
//         if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
//             return false;
//         }
//     }
//     return true;
// };
