const { createERC20 } = require('./ERC20')

module.exports = createERC20({
    symbol: 'GNT',
    name: 'Golem',
    color: '#032F62',
    contract_address: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
    labels: 'gtn ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2
})
