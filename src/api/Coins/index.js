const list = ['BTC', 'ETH', 'ANT', 'ZRX', 'QTUM', 'TRX', 'EOS', 'OMG', 'BNB']
const Coins = {}

exports.Coins = Coins

list.forEach(symbol => {
    let coin = require('./' + symbol)
    Coins[symbol] = require('./' + symbol)
    exports[symbol] = coin
})

const CoinsCopy = Object.assign({}, Coins)
delete CoinsCopy.Coins
Coins.Coins = CoinsCopy
