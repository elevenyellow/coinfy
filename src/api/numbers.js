import Big from 'big.js'


export function decimals(value, n=2) {
    return value.toFixed(n)
}

export function round(value, n=0) {
    const multiplier = Math.pow(10, n)
    return Math.round(value * multiplier) / multiplier
}

export function numberWithSeparation(value, separation=',') {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separation);
}