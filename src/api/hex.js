import { bigNumber, padLeftEven } from '/api/numbers'

export function decodeSolidityString(str) {
    str = removeHexPrefix(str)
    const bytes = 64
    const args = str.length / bytes
    const first = str.substr(0, bytes)
    if (args === 3 && hexToDec(first) === 32) {
        const length = hexToDec(str.substr(bytes, bytes))
        return hexToAscii(str.substr(bytes * 2, bytes)).substr(0, length)
    }
    // for (let arg_index = 0; arg_index < args; arg_index++) {
    //     let arg = str.substr(arg_index * bytes, bytes)
    //     console.log(arg, hexToAscii(arg), hexToDec(arg))
    // }
    return null
}

export function decToHex(number) {
    return bigNumber(number).toString(16)
    // if (typeof number !== 'number') number = Number(number)
    // return number.toString(16)
}

export function hexToDec(hex_string) {
    return parseInt(hex_string, 16)
}

export function hexToAscii(hex) {
    let str = ''
    let i = 0,
        l = hex.length
    if (hex.substring(0, 2) === '0x') {
        i = 2
    }
    for (; i < l; i += 2) {
        let code = parseInt(hex.substr(i, 2), 16)
        str += String.fromCharCode(code)
    }

    return str
}

export function sanitizeHex(hex) {
    hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex
    if (hex == '') return ''
    return '0x' + padLeftEven(hex)
}

export function removeHexPrefix(hex) {
    return hex.toLowerCase().replace('0x', '')
}
