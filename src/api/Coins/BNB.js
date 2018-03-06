const { createERC20 } = require('./ERC20')

module.exports = createERC20({
    symbol: 'BNB',
    name: 'Binance',
    color: '#F2B940',
    contract_address: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
    labels: 'bnb qtum ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2
})
