const { localStorageGet } = require('../browser')
const { MAINNET, TESTNET, LOCALSTORAGE_NETWORK } = require('../../const/')

const Coins = {}
const list = [
    'BTC',
    'ETH',
    'LTC',
    // 'BCH',
    'ANT',
    'ZRX',
    'QTUM',
    'TRX',
    'EOS',
    'OMG',
    'BNB',
    'MKR',
    'SNT',
    'REP',
    'SALT',
    'QASH',
    'BAT',
    'GNT',
    'ETHOS',
    'FUN',
    'REQ',
    'KNC',
    'DAI'
]

exports.Coins = Coins

const network_id = Number(localStorageGet(LOCALSTORAGE_NETWORK)) || MAINNET

list.forEach(symbol => {
    const coin = require('./' + symbol)
    if (coin.setupNetwork(network_id, coin.networks)) {
        Coins[symbol] = coin
        exports[symbol] = coin
    }
})

// const CoinsCopy = Object.assign({}, Coins)
// delete CoinsCopy.Coins
// Coins.Coins = CoinsCopy
