import {
    addHexPrefix,
    isValidAddress,
    isValidPrivate,
    privateToAddress,
    privateToPublic
} from 'ethereumjs-util'
import Big from 'big.js'
import { decimalsMax } from '/api/numbers'
import { encryptAES128CTR, decryptAES128CTR, randomBytes } from '/api/crypto'
import { localStorageGet } from '/api/browser'
import { MAINNET, TESTNET } from '/const/networks'

// private
const network = Number(localStorageGet('network')) || MAINNET
const url =
    network === MAINNET
        ? 'https://api.etherscan.io'
        : 'https://ropsten.etherscan.io'

const api_url = `${url}/api`
const api_key = 'GY9KKYEJF1HDEPIAIRGA66R2RIQWQXV9UZ'

// exports
export const type = 'wallet'
export const symbol = 'ETH'
export const name = 'Ethereum'
export const color = '#7a8aec' //'#9c86fe'
export const ascii = ''
export const price_decimals = 0
export const satoshis = 1000000000000000000 // this is WEI actually

export { addHexPrefix } from 'ethereumjs-util'

export function format(value, dec = 18) {
    const tof = typeof value
    if (tof != 'number' && tof != 'string') value = '0'
    return `${decimalsMax(value, dec)} ${symbol}`
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

export function generateRandomWallet() {
    const bytes = randomBytes(32)
    const private_key = new Buffer(bytes, 'hex')
    const address = privateToAddress(private_key)
    // console.log( private_key.toString('hex') );
    return {
        address: addHexPrefix(address.toString('hex')),
        private_key: private_key.toString('hex')
    }
}

export function urlInfo(address) {
    return `${url}/address/${address}`
}

export function urlInfoTx(txid) {
    return `${url}/tx/${txid}`
}

export function fetchBalance(address) {
    return fetch(
        `${api_url}?apikey=${api_key}&module=account&action=balance&address=${address}&tag=latest`
    )
        .then(response => response.json())
        .then(response => {
            // return Number(response.result)/satoshis
            return Big(response.result)
                .div(satoshis)
                .toString()
        })
}

export function fetchTxs(address, from = 0, to = from + 100) {
    return fetch(
        `${api_url}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${api_key}`
    )
        .then(response => response.json())
        .then(json => {
            const data = {
                totalTxs: json.result.length,
                txs: []
            }

            json.result.slice(from, to).forEach(txRaw => {
                let tx = {
                    txid: txRaw.hash,
                    fees: Big(txRaw.gasUsed),
                    time: txRaw.timeStamp,
                    confirmations: txRaw.confirmations,
                    value: Big(txRaw.value)
                        .div(satoshis)
                        .toString()
                    // raw: txRaw,
                }
                if (txRaw.from.toLowerCase() === address.toLowerCase())
                    tx.value = '-' + tx.value

                data.txs.push(tx)
            })
            return data
        })
}

export function fetchSummary(address) {
    const totals = {}
    return fetchBalance(address)
        .then(balance => {
            totals.balance = balance
            return fetchTxs(address)
        })
        .then(txs => Object.assign(txs, totals))
}

// http://ipfs.b9lab.com:8080/ipfs/QmTHdYEYiJPmbkcth3mQvEQQgEamFypLhc9zapsBatQW7Y/throttled_faucet.html
export function fetchRecomendedFee() {
    const fetchOptions = {
        method: 'POST',
        // headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json',
        //     'Access-Control-Allow-Origin': '*'
        // },
        body:
            '{"method":"eth_estimateGas","params":[{"from":"0x64a3561257e3850995f83ef4dec1c948197441c6","to":"0x64A3561257E3850995f83EF4DEc1c948197441C6","value":"0x16345785d8a0000"}],"id":"c8b6677660a9fb3c4ff363d20e45bf86","jsonrpc":"2.0"}'
    }
    return fetch(`https://api.myetherapi.com/rop`, fetchOptions)
        .then(response => response.json())
        .then(e => {
            console.log(e)
            // return e.result
            return 0.021
        })
}

export function encrypt(private_key_encrypted, password) {
    return encryptAES128CTR(private_key_encrypted, password, true, true)
}

export function decrypt(address, private_key_encrypted, password) {
    const private_key = decryptAES128CTR(private_key_encrypted, password, true)

    if (isPrivateKey(private_key)) {
        if (getAddressFromPrivateKey(private_key) === address)
            return private_key
    }

    return false
}

export function getSendProviders() {
    return sendProviders[network === MAINNET ? 'mainnet' : 'testnet']
}

const sendProviders = {
    mainnet: [
        {
            name: 'Bitpay.com',
            url: 'https://insight.bitpay.com/tx/send',
            send: e => {}
        }
    ],
    testnet: [
        {
            name: 'Bitpay.com',
            url: 'https://test-insight.bitpay.com/tx/send',
            send: e => {}
        }
    ]
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
