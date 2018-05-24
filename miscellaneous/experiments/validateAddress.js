const Bitcoin = require('bitcoinjs-lib') // npm i -S bitcoinjs-lib

function validateAddress({ symbol, address, network }) {
    try {
        const { version, hash } = Bitcoin.address.fromBase58Check(address)
        return network.pubKeyHash != version && network.scriptHash != version
            ? false
            : true
    } catch (e) {
        return false
    }
}

console.log(
    validateAddress({
        symbol: 'BTC',
        address: '1EnzoEo21ZxTXs1YEFhKD5gpPzNSQ45hQg',
        network: onChainNetworks.BTC.mainnet
    })
)

console.log(
    validateAddress({
        symbol: 'BTC',
        address: '3JGR1D3mZWYNcQBcX13YMsBCZdr5rut47u',
        network: onChainNetworks.BTC.mainnet
    })
)

console.log(
    validateAddress({
        symbol: 'BTC',
        address: 'mm42obtLkUesaHxj5i236B9hJ7m6yv4Ujg',
        network: onChainNetworks.BTC.testnet
    })
)

console.log(
    validateAddress({
        symbol: 'BTC',
        address: '2N9Cki8ABz6oXuoF24rd5eAFPwwVpEWYctt',
        network: onChainNetworks.BTC.testnet
    })
)

console.log(
    validateAddress({
        symbol: 'LTC',
        address: 'Lbwf7w13nAkwjbgZvY5hX31P7kXSXz3pfR',
        network: onChainNetworks.LTC.mainnet
    })
)

console.log(
    validateAddress({
        symbol: 'LTC',
        address: 'MQUZK6TjWdPoQuTWct2tBWRbtLSXrjVQD9',
        network: onChainNetworks.LTC.mainnet
    })
)
