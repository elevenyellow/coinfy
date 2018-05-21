const { createERC20 } = require('./ERC20')

module.exports = createERC20({
    symbol: 'BAT',
    name: 'Basic Attention Token',
    color: '#FC511F',
    contract_address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
    labels: 'bat ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2
})
