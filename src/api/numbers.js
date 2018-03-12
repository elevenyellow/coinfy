import BigNumber from 'bignumber.js'

BigNumber.config({ ERRORS: false }) // https://github.com/MikeMcl/bignumber.js/issues/11

// Always shows ${max} decimals
export function decimals(value, max = 2) {
    return Number(value).toFixed(max)
}

// If have more than ${max} decimals wil cut it
export function limitDecimals(value, max = 2) {
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

export function parseNumberAsString(number) {
    number = bigNumber(number)
    return number.isNaN() ? '0' : number.toFixed()
    // const tof = typeof number
    // if (tof == 'number' && !isNaN(number)) return number
    // if (tof == 'object' && number !== null) number = number.toString()
    // if (typeof number != 'string') return 0
    // number = number.trim().replace(/,/g, '')
    // number = Number(number)
    // return isNaN(number) ? 0 : number
}

export function padLeftEven(str) {
    str = str.length % 2 != 0 ? '0' + str : str
    return str
}

export function bigNumber(number) {
    return new BigNumber(String(number))
}

export function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

export function formatCoin(value, dec, symbol) {
    const tof = typeof value
    if (tof != 'number' && tof != 'string') value = '0'
    return `${limitDecimals(value, dec)} ${symbol}`
}
