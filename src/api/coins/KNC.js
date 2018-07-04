const { createERC20 } = require('./ERC20')
const { MAINNET } = require('../../const/')

module.exports = createERC20({
    symbol: 'KNC',
    name: 'Kyber Network',
    color: '#61B0A3',
    contract_address: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
    labels: 'kcn ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2,
    networks_availables: [MAINNET]
})
