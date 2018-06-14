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
} from '/api/coins/ETH'

global.fetch = fetch

const seed =
    'civil void tool perfect avocado sweet immense fluid arrow aerobic boil flash'
const private_key =
    'f2d1c6825dbde8b1824761e343c06c4f796bdec7215f31eee1c79f844556b5ec'
const addresses = ['0x4b0e5460304eee08d0f52708ed7a06498e9bc43e']

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

    t.equal(
        cutDecimals(12.123456789012345678901234567),
        '12.123456789012346',
        'cutDecimals'
    )

    t.end()
})

test('Wallets / Address / Accounts / PrivateKeys', t => {
    const wallet = getWalletFromSeed({ seed })

    t.equal(isAddress(wallet.address), true, 'isAddress')

    t.equal(isPrivateKey(wallet.private_key), true, 'isPrivateKey')

    t.deepEqual(
        wallet,
        {
            address: '0xd7e5e389a86a658d7f2f99889e01645351754d50',
            private_key:
                'c559e2ebb7f8d207640e59617ed18c52a7fac4bc7451ee8e4b1ce102601dd464'
        },
        'getWalletFromSeed'
    )

    t.deepEqual(
        getWalletsFromSeed({ seed, count: 2 }),
        [
            {
                address: '0xd7e5e389a86a658d7f2f99889e01645351754d50',
                private_key:
                    'c559e2ebb7f8d207640e59617ed18c52a7fac4bc7451ee8e4b1ce102601dd464'
            },
            {
                address: '0xca95a20a1306aaddeedd12f9725ffc18c7703430',
                private_key: private_key
            }
        ],
        'getWalletsFromSeed'
    )

    t.equal(
        formatAddress(wallet.address),
        '0xD7E5e389a86a658D7F2F99889E01645351754D50',
        'formatAddress'
    )

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

test('discoverAddress', t => {
    const wallet = getWalletFromSeed({ seed })
    return discoverAddress({ seed }).then(({ address, balance }) => {
        t.equal(address, wallet.address)
        t.equal(typeof balance, 'string')
        t.end()
    })
})

test('discoverWallet', t => {
    return discoverWallet({ seed }).then(
        data => {
            t.equal(Array.isArray(data.addresses), true)
            t.equal(typeof data.index, 'number')
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
        t.equal(typeof txs, 'object', 'is object')
        t.equal(typeof txs.totalTxs, 'number', 'totalTxs')
        t.equal(Array.isArray(txs.txs), true, 'txs is array')
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
            t.equal(typeof txs.txs[0].time, 'number', 'time')
            t.equal(typeof txs.txs[0].txid, 'string', 'txid')
        }
        t.end()
    })
})

test('createSimpleTx', t => {
    setupNetwork(TESTNET, networks) // changing to testnet
    return createSimpleTx({
        from_addresses: ['0x64A3561257E3850995f83EF4DEc1c948197441C6'],
        private_keys: [
            'b5d75b789d8e68920a70af5565702fe263921decdc5344cd31e8c58be5d55cc5'
        ],
        to_address: '0x27cB73c2D7Fe089f9D6081Fa1D35149DdF7607b1',
        amount: 1,
        fee: 0.01
    })
        .then(txsigned => {
            t.equal(typeof txsigned, 'string')
            t.end()
        })
        .catch(e => {
            t.equal(e, 'string')
            console.log(e)
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
