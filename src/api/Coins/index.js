const Coins = {}
const list = [
    'BTC',
    'ETH',
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
    'KNC'
]

exports.Coins = Coins

list.forEach(symbol => {
    const coin = require('./' + symbol)
    Coins[symbol] = coin
    exports[symbol] = coin
})

// const CoinsCopy = Object.assign({}, Coins)
// delete CoinsCopy.Coins
// Coins.Coins = CoinsCopy
