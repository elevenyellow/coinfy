import test from 'tape'
import {
    TYPE_COIN,
    MAINNET,
    TESTNET,
    ASSET_LOGO,
    LOCALSTORAGE_NETWORK
} from '/const/'
import {
    networks,
    setupNetwork,
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
    derivation_path
} from '/api/coins/BTC'

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

test('format()', t => {
    t.end()
})
