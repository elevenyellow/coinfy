// import bignumber from 'bignumber.js'


export function decimals(value, n=2) {
    return value.toFixed(n)
}

export function round(value, n=0) {
    const multiplier = Math.pow(10, n)
    return Math.round(value * multiplier) / multiplier
}