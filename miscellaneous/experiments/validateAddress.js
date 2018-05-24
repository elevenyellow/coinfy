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

const onChainNetworks = {
    BTC: {
        mainnet: {
            messagePrefix: '\x18Bitcoin Signed Message:\n',
            bip32: {
                public: 0x049d7cb2,
                private: 0x049d7878
            },
            pubKeyHash: 0x00,
            scriptHash: 0x05,
            wif: 0x80
        },
        testnet: {
            messagePrefix: '\x18Bitcoin Signed Message:\n',
            bip32: {
                public: 71979618,
                private: 71978536
            },
            pubKeyHash: 111,
            scriptHash: 196,
            wif: 239
        }
    },
    LTC: {
        mainnet: {
            messagePrefix: '\x19Litecoin Signed Message:\n',
            bip32: {
                public: 0x01b26ef6,
                private: 0x01b26792
            },
            pubKeyHash: 0x30,
            scriptHash: 0x32,
            wif: 0xb0
        }
    },
    DOGE: {
        messagePrefix: '\u0019Dogecoin Signed Message:\n',
        bip32: { public: 49990397, private: 49988504 },
        pubKeyHash: 30,
        scriptHash: 22,
        wif: 158
    },
    GRLC: {
        //m/44'/1982'/0'/0
        messagePrefix: '\u0019Garlicoin Signed Message:\n',
        bip32: { public: 76067358, private: 76066276 },
        pubKeyHash: 38,
        scriptHash: 50,
        wif: 176
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
