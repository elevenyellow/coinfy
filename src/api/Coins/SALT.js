const { createERC20 } = require('./ERC20')

module.exports = createERC20({
    symbol: 'SALT',
    name: 'Salt',
    color: '#27BABC',
    contract_address: '0x4156D3342D5c385a87D264F90653733592000581',
    labels: 'sat ethereum token erc20 ecr20',
    coin_decimals: 8,
    price_decimals: 2
})
