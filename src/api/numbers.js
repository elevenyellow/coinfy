import BigNumber from 'bignumber.js'

BigNumber.config({ ERRORS: false }) // https://github.com/MikeMcl/bignumber.js/issues/11

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
    if (tof == 'object' && number !== null) number = number.toString()
    if (typeof number != 'string') return 0
    number = number.trim().replace(/,/g, '')
    number = Number(number)
    return isNaN(number) ? 0 : number
}

export function decimalToHex(number) {
    return bigNumber(number).toString(16)
    // if (typeof number !== 'number') number = Number(number)
    // return number.toString(16)
}

export function sanitizeHex(hex) {
    hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex
    if (hex == '') return ''
    return '0x' + padLeftEven(hex)
}

export function padLeftEven(hex) {
    hex = hex.length % 2 != 0 ? '0' + hex : hex
    return hex
}

export function bigNumber(number) {
    return new BigNumber(String(number))
}
