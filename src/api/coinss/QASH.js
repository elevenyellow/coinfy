const { createERC20 } = require('./ERC20')

module.exports = createERC20({
    symbol: 'QASH',
    name: 'Qash',
    color: '#1A4EE4',
    contract_address: '0x618e75ac90b12c6049ba3b27f5d5f8651b0037f6',
    labels: 'qahs ethereum token erc20 ecr20',
    coin_decimals: 6,
    price_decimals: 2
})
