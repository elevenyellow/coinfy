import test from 'tape'
import fetch from 'node-fetch'
import BigNumber from 'bignumber.js'

import {
    TYPE_COIN,
    MAINNET,
    TESTNET,
    ASSET_LOGO,
    LOCALSTORAGE_NETWORK
} from '/const/'
import {
    setupNetwork,
    networks,
    type,
    symbol,
    symbol_fee,
    name,
    color,
    ascii,
    coin_decimals,
    price_decimals,
    satoshis,
    multiaddress,
    changeaddress,
    labels,
    logo,
    derivation_path,
    format,
    cutDecimals,
    toSatoshis,
    getWalletFromSeed,
    getWalletsFromSeed,
    isAddress,
    isPrivateKey,
    formatAddress,
    getAddressFromPrivateKey,
    getSegwitAddressFromPrivateKey,
    urlInfo,
    urlInfoTx,
    urlDecodeTx,
    encryptSeed,
    decryptSeed,
    encryptPrivateKey,
    decryptPrivateKey,
    decryptPrivateKeyFromSeed,
    getNextWalletFromSeed,
    decryptWalletFromSeed,
    encryptBIP38,
    decryptBIP38,
    discoverAddress,
    discoverWallet,
    fetchBalance,
    fetchRecomendedFee,
    fetchTxs,
    createSimpleTx,
    getSendProviders
} from '/api/coins/BTC'

global.fetch = fetch

const seed =
    'civil void tool perfect avocado sweet immense fluid arrow aerobic boil flash'
const private_key = 'L5YsAenc5eCuDFhEcC9DNe8sw47ttEevfMieRWKjGK5cP6ZpvxyE'
const addresses = ['34QtpB4V3ETz2p3QuNEdEqTCYjTHHP2XMY']

test('setupNetwork', t => {
    t.equal(setupNetwork(MAINNET, networks), true, 'setupNetwork')
    t.end()
})

test('Exists / Types', t => {
    t.equal(typeof networks, 'object', 'networks')
    t.equal(typeof networks[MAINNET], 'object', 'networks 2')
    t.equal(typeof networks[MAINNET].url, 'string', 'networks 3')
    // t.equal(typeof networks[MAINNET].network, 'object', 'networks 4')

    t.equal(typeof setupNetwork, 'function', 'setupNetwork')

    t.equal(type, TYPE_COIN, 'type')
    t.equal(typeof symbol, 'string', 'symbol')
    t.equal(typeof symbol_fee, 'string', 'symbol_fee')
    t.equal(typeof name, 'string', 'name')
    t.equal(typeof color, 'string', 'color')
    t.equal(typeof color, 'string', 'color')
    t.equal(typeof ascii, 'string', 'ascii')
    t.equal(typeof coin_decimals, 'number', 'coin_decimals')
    t.equal(typeof price_decimals, 'number', 'price_decimals')
    t.equal(typeof satoshis, 'number', 'satoshis')
    t.equal(typeof multiaddress, 'boolean', 'multiaddress')
    t.equal(typeof changeaddress, 'boolean', 'changeaddress')
    t.equal(typeof labels, 'string', 'labels')
    t.equal(typeof logo, 'string', 'logo')

    t.equal(typeof derivation_path, 'object', 'derivation_path')
    t.equal(typeof derivation_path.mainnet, 'function', 'derivation_path 2')

    t.end()
})

test('Numbers', t => {
    t.equal(format(12), `12 ${symbol}`, 'format')
    t.equal(format(12.12345, 4), `12.1234 ${symbol}`, 'format 2')

    t.equal(cutDecimals(12.123456789), `12.12345678`, 'cutDecimals')

    t.end()
})

test('Wallets / Address / Accounts / PrivateKeys', t => {
    const wallet = getWalletFromSeed({ seed })
    const wallet2 = getWalletFromSeed({ seed, segwit: false })

    t.equal(isAddress(wallet.address), true, 'isAddress')

    t.equal(isPrivateKey(wallet.private_key), true, 'isPrivateKey')

    t.deepEqual(
        wallet,
        {
            address: '39hFXsmKPPNuKmMspjLvi5BT1n5XjbA4CT',
            private_key: 'L16cg8Azn34WH8BKGqAQsJ1c59UJDhCuLR3JZafUi1ASJEVZ96FH'
        },
        'getWalletFromSeed'
    )

    t.deepEqual(
        getWalletFromSeed({ seed, segwit: false }),
        {
            address: '1KMyB2466uJzWuJgwxMEYud6xhAexJHwyM',
            private_key: 'L1FAYi6Hk6X9fa8NGDp5Whh7GBUfpuHeU6wcEdHQeZ6rfb4VG2y7'
        },
        'getWalletFromSeed'
    )

    t.deepEqual(
        getWalletsFromSeed({ seed, count: 2 }),
        [
            {
                address: '39hFXsmKPPNuKmMspjLvi5BT1n5XjbA4CT',
                private_key:
                    'L16cg8Azn34WH8BKGqAQsJ1c59UJDhCuLR3JZafUi1ASJEVZ96FH'
            },
            {
                address: '3QTyfe1J3CETz99TGynuip4DTGWAwfEpu6',
                private_key: private_key
            }
        ],
        'getWalletsFromSeed'
    )

    t.equal(
        getSegwitAddressFromPrivateKey(wallet.private_key),
        wallet.address,
        'getSegwitAddressFromPrivateKey'
    )

    t.equal(
        getAddressFromPrivateKey(wallet2.private_key),
        wallet2.address,
        'getAddressFromPrivateKey'
    )

    t.equal(formatAddress(wallet.address), wallet.address, 'formatAddress')

    t.end()
})

test('Urls', t => {
    t.equal(typeof urlInfo('addres'), 'string', 'urlInfo')
    t.equal(typeof urlInfoTx('addres'), 'string', 'urlInfoTx')
    t.equal(typeof urlDecodeTx('addres'), 'string', 'urlDecodeTx')
    t.end()
})

test('encryptSeed decryptSeed', t => {
    const pass = '1234'
    const wallet = getWalletFromSeed({ seed })
    const encrypted = encryptSeed(seed, pass)
    const decrypted = decryptSeed([wallet.address], encrypted, pass)

    t.equal(typeof encrypted, 'object', 'encryptSeed')
    t.equal(typeof encrypted.ciphertext, 'string', 'encryptSeed 2')
    t.equal(encrypted.cipher, 'aes-128-ctr', 'encryptSeed 2')
    t.equal(encrypted.kdf, 'scrypt', 'encryptSeed 3')
    t.equal(typeof encrypted.kdfparams, 'object', 'encryptSeed 4')

    t.equal(decrypted, seed, 'decryptSeed')

    t.end()
})

test('encryptPrivateKey decryptPrivateKey', t => {
    const pass = '1234'
    const address = getAddressFromPrivateKey(private_key)
    const encrypted = encryptPrivateKey(private_key, pass)
    const decrypted = decryptPrivateKey(address, encrypted, pass)

    t.equal(typeof encrypted, 'object', 'encryptPrivateKey')
    t.equal(typeof encrypted.ciphertext, 'string', 'encryptPrivateKey 2')
    t.equal(encrypted.cipher, 'aes-128-ctr', 'encryptPrivateKey 2')
    t.equal(encrypted.kdf, 'scrypt', 'encryptPrivateKey 3')
    t.equal(typeof encrypted.kdfparams, 'object', 'encryptPrivateKey 4')

    t.equal(decrypted, private_key, 'decryptPrivateKey')

    t.end()
})

test('decryptPrivateKeyFromSeed', t => {
    const pass = '1234'
    const wallets = getWalletsFromSeed({ seed, count: 2 })
    const encrypted = encryptSeed(seed, pass)
    const private_key = decryptPrivateKeyFromSeed(
        wallets[1].address,
        wallets.map(wallet => wallet.address),
        encrypted,
        pass
    )

    t.equal(private_key, wallets[1].private_key)

    t.end()
})

test('getNextWalletFromSeed', t => {
    const pass = '1234'
    const wallets = getWalletsFromSeed({ seed, count: 3 })
    const encrypted = encryptSeed(seed, pass)
    const wallet = getNextWalletFromSeed(
        wallets[1].address,
        wallets.map(wallet => wallet.address),
        encrypted,
        pass
    )

    t.deepEqual(wallet, wallets[2])

    t.end()
})

test('decryptWalletFromSeed', t => {
    const pass = '1234'
    const wallets = getWalletsFromSeed({ seed, count: 3 })
    const encrypted = encryptSeed(seed, pass)
    const wallet = decryptWalletFromSeed(
        wallets[1].address,
        wallets.map(wallet => wallet.address),
        encrypted,
        pass
    )

    t.equal(wallet.address, wallets[1].address, 'decryptWalletFromSeed.address')
    t.equal(
        wallet.private_key,
        wallets[1].private_key,
        'decryptWalletFromSeed.private_key'
    )
    t.equal(wallet.seed, seed, 'decryptWalletFromSeed.seed')

    t.end()
})

test('encryptBIP38 decryptBIP38', t => {
    const pass = '1234'
    const encrypted = encryptBIP38(private_key, pass)
    const decrypted = decryptBIP38(encrypted, pass)

    t.equal(private_key, decrypted)

    t.end()
})

test('discoverAddress', t => {
    const wallet = getWalletFromSeed({ seed, segwit: false })
    return discoverAddress({ seed }).then(
        ({ address, balance, totalReceived }) => {
            t.equal(address, wallet.address)
            t.equal(typeof balance, 'string')
            t.equal(typeof totalReceived, 'string')
            t.end()
        }
    )
})

test('discoverAddress segwit', t => {
    const wallet = getWalletFromSeed({ seed, segwit: true })
    return discoverAddress({ seed, segwit: true }).then(
        ({ address, balance, totalReceived }) => {
            t.equal(address, wallet.address)
            t.end()
        }
    )
})

test('discoverWallet', t => {
    return discoverWallet({ seed }).then(
        data => {
            t.equal(Array.isArray(data.addresses), true)
            t.equal(typeof data.index, 'number')
            t.equal(typeof data.segwit, 'boolean')
            t.equal(data.address, data.addresses[data.addresses.length - 1])
            t.end()
        },
        wallet => {
            // to do
        }
    )
})

test('fetchRecomendedFee', t => {
    return fetchRecomendedFee({
        addresses: addresses
    }).then(fee => {
        t.equal(typeof fee, 'string')
        t.equal(typeof Number(fee), 'number')
        t.equal(isNaN(Number(fee)), false)
        t.end()
    })
})

test('fetchTxs', t => {
    return fetchTxs(addresses).then(txs => {
        t.equal(typeof txs, 'object')
        t.equal(typeof txs.totalTxs, 'number')
        t.equal(Array.isArray(txs.txs), true)
        if (txs.txs.length > 0) {
            t.equal(typeof txs.txs[0].value, 'string', 'value')
            t.equal(
                BigNumber(txs.txs[0].value).toFixed(),
                txs.txs[0].value,
                'value fixnumber'
            )
            t.equal(typeof txs.txs[0].fees, 'string', 'fees')
            t.equal(
                BigNumber(txs.txs[0].fees).toFixed(),
                txs.txs[0].fees,
                'fees fixnumber'
            )
            t.equal(typeof txs.txs[0].time, 'number')
            t.equal(typeof txs.txs[0].txid, 'string')
        }
        t.end()
    })
})

test('createSimpleTx', t => {
    setupNetwork(TESTNET, networks) // changing to testnet
    return createSimpleTx({
        from_addresses: ['mm42obtLkUesaHxj5i236B9hJ7m6yv4Ujg'],
        private_keys: ['cRkNqWAK64qSooKnadaFLa9uhSK1QtgkD5ezJQcsn1Fz5LQSnHT5'],
        to_address: '2N9Cki8ABz6oXuoF24rd5eAFPwwVpEWYctt',
        amount: 1,
        fee: 0.01
    }).then(txsigned => {
        t.equal(typeof txsigned, 'string')
        t.end()
    })
})

test('getSendProviders', t => {
    setupNetwork(MAINNET, networks) // changing to testnet
    const providers = getSendProviders()
    t.equal(Array.isArray(providers), true)
    t.equal(typeof providers[0].name, 'string')
    t.equal(typeof providers[0].url, 'string')
    t.equal(typeof providers[0].send, 'function')
    t.end()
})
