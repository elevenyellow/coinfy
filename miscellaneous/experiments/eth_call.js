const { sha3, addHexPrefix } = require('ethereumjs-util')
const abiDecoder = require('abi-decoder')

const testABI = [
    {
        inputs: [{ type: 'address', name: '' }],
        constant: true,
        name: 'isInstantiation',
        payable: false,
        outputs: [{ type: 'bool', name: '' }],
        type: 'function'
    },
    {
        inputs: [
            { type: 'address[]', name: '_owners' },
            { type: 'uint256', name: '_required' },
            { type: 'uint256', name: '_dailyLimit' }
        ],
        constant: false,
        name: 'create',
        payable: false,
        outputs: [{ type: 'address', name: 'wallet' }],
        type: 'function'
    },
    {
        inputs: [{ type: 'address', name: '' }, { type: 'uint256', name: '' }],
        constant: true,
        name: 'instantiations',
        payable: false,
        outputs: [{ type: 'address', name: '' }],
        type: 'function'
    },
    {
        inputs: [{ type: 'address', name: 'creator' }],
        constant: true,
        name: 'getInstantiationCount',
        payable: false,
        outputs: [{ type: 'uint256', name: '' }],
        type: 'function'
    },
    {
        inputs: [
            { indexed: false, type: 'address', name: 'sender' },
            { indexed: false, type: 'address', name: 'instantiation' }
        ],
        type: 'event',
        name: 'ContractInstantiation',
        anonymous: false
    }
]
abiDecoder.addABI(testABI)

console.log(
    abiDecoder.decodeMethod(
        '0x53d9d9100000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a6d9c5f7d4de3cef51ad3b7235d79ccc95114de5000000000000000000000000a6d9c5f7d4de3cef51ad3b7235d79ccc95114daa'
    )
)

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
console.log(
    getDataContractMethodCall(
        'balanceOf(address)',
        '0xf9e4f0c2917d29753eca437f94b2997e597f3510'
    )
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
