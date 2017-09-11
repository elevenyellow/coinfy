// import bignumber from 'bignumber.js'


export function round(value, decimals=2) {
    const multiplier = Math.pow(10, decimals)
    return Math.round(value * multiplier) / multiplier
}
