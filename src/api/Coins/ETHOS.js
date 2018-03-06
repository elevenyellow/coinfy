const { createERC20 } = require('./ERC20')

module.exports = createERC20({
    symbol: 'ETHOS',
    name: 'Ethos',
    color: '#21CEAB',
    contract_address: '0x5af2be193a6abca9c8817001f45744777db30756',
    labels: 'ethereum token erc20 ecr20',
    coin_decimals: 8,
    price_decimals: 2
})
