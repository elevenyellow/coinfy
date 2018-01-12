import { bigNumber } from '/api/numbers'
import { url, api_url, api_key } from '/api/Coins/ETH'
import { ERC20 } from '/const/coin_types'

// https://tokenstandard.codetract.io/
export { ascii, format, encrypt, decrypt, fetchSummary, urlInfoTx } from './ETH' // '/api/Coins/ETH' not working

export const type = ERC20

export function urlInfoRaw(address, handler) {
    return `https://etherscan.io/token/${handler}?a=${address}`
}

export function fetchBalanceRaw(address, contract_address, coin_decimals = 18) {
    return fetch(
        `${api_url}?apikey=${api_key}&module=account&action=tokenbalance&contractaddress=${contract_address}&address=${address}&tag=latest`
    )
        .then(response => response.json())
        .then(response => {
            return bigNumber(response.result)
                .div(Math.pow(10, coin_decimals))
                .toString()
        })
}

// const instruction_getbalance = '0x70a08231'
// const instruction_transfer = '0xa9059cbb'

// function getBalance(contract_address, address) {
//     return {
//         method: 'eth_call',
//         params: [
//             {
//                 to: contract_address,
//                 data: `${instruction_getbalance}${padLeft(
//                     removeHexPrefix(address),
//                     64
//                 )}`
//             }
//         ]
//     }
// }

// console.log(
//     getBalance(
//         '0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0',
//         '0xc0c2a4efe73a48091cca7b81fbe86bc631f88d80'
//     )
// )
