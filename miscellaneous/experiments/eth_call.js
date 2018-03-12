const { sha3, addHexPrefix } = require('ethereumjs-util')
const request = require('request')
const BigNumber = require('bignumber.js')
const abiDecoder = require('abi-decoder')
var abi = require('ethereumjs-abi')
const Web3 = require('web3')
const web3 = new Web3()

function hexToAscii(hex) {
    var str = ''
    var i = 0,
        l = hex.length
    if (hex.substring(0, 2) === '0x') {
        i = 2
    }
    for (; i < l; i += 2) {
        var code = parseInt(hex.substr(i, 2), 16)
        str += String.fromCharCode(code)
    }

    return str
}

function padLeft(n, width, z) {
    z = z || '0'
    n = n + ''
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}
function removeHexPrefix(hex) {
    return hex.toLowerCase().replace('0x', '')
}

// https://tokenstandard.codetract.io/
// getDataContractMethodCall('balanceOf(address)', '0xf9e4f0c2917d29753eca437f94b2997e597f3510')
function getDataContractMethodCall(method_name) {
    let args = Array.prototype.slice.call(arguments, 1)
    let data = addHexPrefix(
        sha3(method_name)
            .toString('hex')
            .slice(0, 8)
    )

    data = data + args.map(arg => padLeft(removeHexPrefix(arg), 64)).join('')
    return data
}

const data = getDataContractMethodCall(
    'name()'
    // 'decimals()'
    // 'balanceOf(address)',
    // '0xf9e4f0c2917d29753eca437f94b2997e597f3510'
)
console.log('data:', data)

const contract_address = '0x960b236a07cf122663c4303350609a66a7b288c0'
// https://api.etherscan.io/api?module=contract&action=getabi&address=0x960b236a07cf122663c4303350609a66a7b288c0&apikey=YourApiKeyToken
request(
    `https://api.etherscan.io/api?module=proxy&action=eth_call&to=${contract_address}&data=${data}`,
    (error, response, body) => {
        body = JSON.parse(body)
        console.log('body:', body)

        // console.log('hexToAscii:', hexToAscii(body.result))
        try {
            console.log(
                'web3.hexToAscii:',
                web3.utils.hexToAscii(body.result).length
            )
        } catch (e) {}
        try {
            console.log('web3.toAscii:', web3.utils.toAscii(body.result).length)
        } catch (e) {}
        try {
            console.log('web3.toUtf8:', web3.utils.toUtf8(body.result).length)
        } catch (e) {}
        try {
            console.log(
                'web3.hexToNumber:',
                web3.utils.hexToNumber(body.result).length
            )
        } catch (e) {}
        try {
            console.log(
                'web3.hexToNumberString:',
                web3.utils.hexToNumberString(body.result).length
            )
        } catch (e) {}
        try {
            console.log(
                'web3.hexToString:',
                web3.utils.hexToString(body.result).length
            )
        } catch (e) {}
        try {
            console.log(
                'web3.hexToUtf8:',
                web3.utils.hexToUtf8(body.result).length
            )
        } catch (e) {}
        try {
            console.log(
                'web3.abi.decodeParameter:',
                web3.eth.abi.decodeParameter('string', body.result)
            )
        } catch (e) {}
    }
)

// function JSONRpc(url, method, params, id = Math.random()) {
//     const body = {
//         method: method,
//         id: String(id),
//         jsonrpc: '2.0'
//     }

//     if (Array.isArray(params)) body.params = params

//     const fetchOptions = {
//         method: 'POST',
//         body: JSON.stringify(body),
//         headers: {
//             //     Accept: 'application/json',
//             'Content-Type': 'application/json; charset=UTF-8'
//             //     'Access-Control-Allow-Origin': '*'
//         }
//     }

//     return fetch(url, fetchOptions)
// }

// function padLeft(n, width, z) {
//     z = z || '0'
//     n = n + ''
//     return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
// }

// function removeHexPrefix(hex) {
//     return hex.toLowerCase().replace('0x', '')
// }

// // https://tokenstandard.codetract.io/
// // https://ethereum.stackexchange.com/questions/16959/how-to-know-the-hex-code-to-use-in-data-to-call-a-specific-contract-function
// const instruction_getbalance = '0x70a08231'
// const instruction_transfer = '0xa9059cbb'

// function getBalance(address, contract_address) {
//     return JSONRpc('https://api.myetherapi.com/eth', 'eth_call', [
//         {
//             to: contract_address,
//             data: `${instruction_transfer}${padLeft(
//                 removeHexPrefix(address),
//                 64
//             )}`
//         },
//         '0x00'
//     ])
//         .then(response => response.json())
//         .then(response => {
//             console.log(
//                 response
//                 // bigNumber(response.result)
//                 //     .div(bigNumber(10).pow(18))
//                 //     .toString()
//             )
//         })
// }

// getBalance(
//     '0xf9e4f0c2917d29753eca437f94b2997e597f3510',
//     '0x960b236a07cf122663c4303350609a66a7b288c0'
// )

// // const value = ethFuncs.padLeft(
// //     new BigNumber(value)
// //         .times(new BigNumber(10).pow(this.getDecimal()))
// //         .toString(16),
// //     64
// // )
// // const toAdd = ethFuncs.padLeft(ethFuncs.getNakedAddress(toAdd), 64)
// // const data = Token.transferHex + toAdd + value
