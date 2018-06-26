import {
    addHexPrefix,
    isValidAddress,
    isValidPrivate,
    privateToAddress,
    privateToPublic,
    sha3
} from 'ethereumjs-util'
import EthereumTx from 'ethereumjs-tx'
import createKeccakHash from 'keccak'
import { getBip32RootKey } from '/api/bip39'
import { formatCoin, limitDecimals, bigNumber } from '/api/numbers'
import { decToHex, hexToDec, sanitizeHex, removeHexPrefix } from '/api/hex'
import { padLeft } from '/api/strings'
import { encryptAES128CTR, decryptAES128CTR, randomBytes } from '/api/crypto'
import {
    TYPE_COIN,
    MAINNET,
    TESTNET,
    ASSET_LOGO,
    LOCALSTORAGE_NETWORK
} from '/const/'

// private
export const api_key = 'GY9KKYEJF1HDEPIAIRGA66R2RIQWQXV9UZ'
export const networks = {
    [MAINNET]: {
        // mainnet
        api_url: 'https://api.etherscan.io/api',
        url: 'https://etherscan.io',
        url_myetherapi: 'https://api.myetherapi.com/eth'
    },
    [TESTNET]: {
        // mainnet
        api_url: 'https://ropsten.etherscan.io/api',
        url: 'https://ropsten.etherscan.io',
        url_myetherapi: 'https://api.myetherapi.com/rop'
    }
}

let network_id, url, url_myetherapi, api_url
export function setupNetwork(id, networks) {
    const network_data = networks[id]
    if (typeof network_data !== 'undefined') {
        network_id = id
        api_url = network_data.api_url
        url = network_data.url
        url_myetherapi = network_data.url_myetherapi
        return true
    }
    return false
}

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
export const multiaddress = false
export const changeaddress = false // if true we change the remaining balance to the next address
export const default_gas_limit = 21000
export const labels = 'eth coin etereum'
export const logo = ASSET_LOGO(symbol)
export const networks_availables = [MAINNET, TESTNET]

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
    return isValidAddress(string) // /^(0x)?[0-9a-fA-F]{40}$/.test(string)
}

export function isPrivateKey(string) {
    return /^(0x)?([0-9a-fA-F]{64}|[0-9a-fA-F]{66}|[0-9a-fA-F]{128}|[0-9a-fA-F]{13})$/.test(
        string
    )
}

// export function isPrivateKeyCheck(string) {
//     return isValidPrivate(stringToBuffer(string))
// }

export function formatAddress(address) {
    return toChecksumAddress(address)
}

export function getAddressFromPrivateKey(private_key) {
    return addHexPrefix(
        privateToAddress(stringToBuffer(removeHexPrefix(private_key))).toString(
            'hex'
        )
    )
}

export function getPublicFromPrivateKey(private_key) {
    return privateToPublic(
        stringToBuffer(removeHexPrefix(private_key))
    ).toString('hex')
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

export function discoverAddress({
    seed,
    contract_address,
    satoshis,
    index = 0
}) {
    return new Promise(resolve => {
        const wallet = getWalletFromSeed({
            seed,
            index
        })
        const address = wallet.address
        fetchBalance(address, contract_address, satoshis).then(balance => {
            resolve({
                address,
                balance
            })
        })
    })
}

export function discoverWallet(
    { seed, contract_address, satoshis },
    onDiscoverAddress
) {
    return new Promise(resolve => {
        let index = 0
        const addresses = []
        const onPush = wallet => {
            if (onDiscoverAddress) onDiscoverAddress(wallet)
            addresses.push(wallet.address)
        }
        const onFetch = () => {
            discoverAddress({ seed, index, contract_address, satoshis }).then(
                wallet => {
                    const balance = wallet.balance
                    if (balance > 0) {
                        index += 1
                        onPush(wallet)
                        onFetch()
                    } else {
                        if (addresses.length === 0) {
                            index += 1
                            onPush({ address: wallet.address, balance: 0 })
                        }
                        resolve({
                            address: addresses[addresses.length - 1],
                            addresses,
                            index
                        })
                    }
                }
            )
        }
        onFetch()
    })
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
    addresses,
    from = 0,
    to = from + 100,
    contract_address,
    _satoshis = satoshis
) {
    const address = addresses[0]
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
                fees: bigNumber(txRaw.gasUsed).toFixed(),
                time: Number(txRaw.timeStamp),
                confirmations: txRaw.confirmations,
                value: bigNumber(txRaw.value)
                    .div(_satoshis)
                    .toFixed()
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
    from_addresses,
    to_address,
    private_keys,
    amount,
    fee,
    gas_limit = default_gas_limit,
    data,
    current_address
}) {
    const index = from_addresses.indexOf(current_address)
    const from_address = from_addresses[index]
    const private_key = private_keys[index]
    // const from_address = getAddressFromPrivateKey(private_key)
    // return JSONRpc(url_myetherapi, 'eth_getTransactionCount', [
    //     from_address,
    //     'pending'
    // ])
    return fetch(
        `${api_url}?module=proxy&action=eth_getTransactionCount&tag=latest&address=${from_address}&apikey=${api_key}`
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
                        bigNumber(fee)
                            .times(satoshis)
                            .div(gas_limit)
                            .round()
                    )
                ),
                // gasPrice: '0x04a817c800',
                // gasLimit: '0x016f2e',
                nonce: sanitizeHex(e.result),
                to: sanitizeHex(to_address),
                value: sanitizeHex(
                    decToHex(
                        bigNumber(amount)
                            .times(satoshis)
                            .round()
                    )
                )
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
    // seed_encrypted.hash = sha3(seed).toString('hex')
    return seed_encrypted
}

export function decryptSeed(addresses, seed_encrypted, password) {
    const seed = decryptAES128CTR(seed_encrypted, password)
    const wallet = getWalletFromSeed({ seed })
    if (addresses.includes(wallet.address)) return seed
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
        return getWalletFromSeed({ seed: wallet.seed, index: wallet.index + 1 })
}

export function decryptWalletFromSeed(
    address,
    addresses,
    seed_encrypted,
    password
) {
    const seed = decryptAES128CTR(seed_encrypted, password)
    // for (let index = 0, wallet; index < addresses.length; index++) {
    for (let index = addresses.length - 1, wallet; index >= 0; index--) {
        wallet = getWalletFromSeed({ seed, index })
        if (wallet.address === address) {
            wallet.seed = seed
            wallet.index = index
            return wallet
        }
    }
}

export function getSendProviders() {
    return sendProviders[network_id === MAINNET ? 'mainnet' : 'testnet']
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

function toChecksumAddress(address) {
    address = address.toLowerCase().replace('0x', '')
    let hash = createKeccakHash('keccak256')
        .update(address)
        .digest('hex')
    let ret = '0x'

    for (let i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) >= 8) {
            ret += address[i].toUpperCase()
        } else {
            ret += address[i]
        }
    }

    return ret
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
