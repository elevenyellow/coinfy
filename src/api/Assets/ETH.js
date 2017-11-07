// import { createHash } from 'crypto'


export const type = 'wallet'
export const symbol = 'ETH'
export const name = 'Ethereum'
export const color = '#9c86fe'
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
};


export function fetchBalance(address) {
    return fetch(`http://www.google.es/addr/${address}/balance`)
        // .then(response => response.text())
        .then(balance => {
            return Number(1)
        })
}



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