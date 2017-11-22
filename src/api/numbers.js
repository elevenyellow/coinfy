import Big from 'big.js'


export function decimals(value, max = 2) {
    return Number(value).toFixed(max)
}

export function decimalsMax(value, max = 2) {
    const valueString = String(value)
    const index = valueString.indexOf('.')
    const totalDecimals = valueString.length - valueString.indexOf('.') - 1
    if (index === -1 || totalDecimals < max) return valueString
    return valueString.substr(0, index + (max > 1 ? max + 1 : 0))
}

export function round(value, n = 0) {
    const multiplier = Math.pow(10, n)
    return Math.round(value * multiplier) / multiplier
}

export function numberWithSeparation(value, separation = ',') {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separation)
}

export function parseNumber(number) {
    const tof = typeof number
    if (tof == 'number' && !isNaN(number)) return number
    if (tof != 'string') return 0
    number = number.trim().replace(/,/g,'')
    number = Number(number)
    return isNaN(number) ? 0 : number
}