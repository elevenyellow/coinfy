// import { createHash } from 'crypto'

const api_url = 'https://ropsten.etherscan.io/api'
const api_key = 'GY9KKYEJF1HDEPIAIRGA66R2RIQWQXV9UZ'

export const type = 'wallet'
export const symbol = 'ETH'
export const name = 'Ethereum'
export const color = '#7a8aec'//'#9c86fe'
export const ascii = ''
export const price_decimals = 0
export const satoshis = 100000000

export function format(value) {
    const tof = typeof value
    if (tof != 'number' && tof != 'string') value = '0'
    return `${value} ${symbol}`
}

export function isAddress(address) {
    return /^(0x)?[0-9a-fA-F]{40}$/.test(address)
}

export function fetchBalance(address) {
    return fetch(
        `${api_url}?apikey=${api_key}&module=account&action=balance&address=${address}&tag=latest`
    )
        .then(response => response.json())
        .then(response => {
            console.log( response.result );
            return Number(response.result)
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
