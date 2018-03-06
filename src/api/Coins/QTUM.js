const { createERC20 } = require('./ERC20')

module.exports = createERC20({
    symbol: 'QTUM',
    name: 'Qtum',
    color: '#6FC5EB',
    contract_address: '0x9a642d6b3368ddc662ca244badf32cda716005bc',
    labels: 'qtm ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2
})
