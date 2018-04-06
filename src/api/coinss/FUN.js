const { createERC20 } = require('./ERC20')

module.exports = createERC20({
    symbol: 'FUN',
    name: 'FunFair',
    color: '#EF3B5D',
    contract_address: '0x419d0d8bdd9af5e606ae2232ed285aff190e711b',
    labels: 'fum ethereum token erc20 ecr20',
    coin_decimals: 8,
    price_decimals: 3
})
