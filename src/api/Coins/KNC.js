const { createERC20 } = require('./ERC20')

module.exports = createERC20({
    symbol: 'KNC',
    name: 'Kyber Network',
    color: '#61B0A3',
    contract_address: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
    labels: 'kcn ethereum token erc20 ecr20',
    coin_decimals: 8,
    price_decimals: 2
})
