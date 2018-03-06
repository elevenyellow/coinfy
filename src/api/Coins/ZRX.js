const { createERC20 } = require('./ERC20')

module.exports = createERC20({
    symbol: 'ZRX',
    name: '0x',
    color: '#1E2227',
    contract_address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
    labels: 'zrx project ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2
})
