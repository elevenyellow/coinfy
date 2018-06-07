import test from 'tape'
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
    encryptSeed
} from '/api/coins/BTC'

const seed =
    'civil void tool perfect avocado sweet immense fluid arrow aerobic boil flash'

test('setupNetwork', t => {
    t.equal(setupNetwork(MAINNET, networks), true, 'setupNetwork')
    t.end()
})

test('Exists / Types', t => {
    t.equal(typeof networks, 'object', 'networks')
    t.equal(typeof networks[MAINNET], 'object', 'networks 2')
    t.equal(typeof networks[MAINNET].url, 'string', 'networks 3')
    t.equal(typeof networks[MAINNET].network, 'object', 'networks 4')

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

    t.equal(toSatoshis(1), 100000000, 'toSatoshis')

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
                private_key:
                    'L5YsAenc5eCuDFhEcC9DNe8sw47ttEevfMieRWKjGK5cP6ZpvxyE'
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

test('Encrypt / Decrypt', t => {
    t.deepEqual(
        encryptSeed(seed, '1234'),
        {
            ciphertext:
                '9dc38630a1d74b7a1a703fb80382604ea4aa5551249549629fdde5f9627a3dc324ae7958a648fdb5ad15050d35bc3a5d14f8042e8bc1dea74a503280ce9ecb0aca8990214053c0f604146f79',
            cipherparams: { iv: '7e3dcc4f3343549dce29fff67fd75fb1' },
            cipher: 'aes-128-ctr',
            kdf: 'scrypt',
            kdfparams: {
                dklen: 32,
                salt:
                    '71c1d4bbb8a54373ec07644aec2a40da132d699910887c548e78a54c047d7aab',
                n: 8192,
                r: 8,
                p: 1
            }
        },
        'encryptSeed'
    )
    t.end()
})
