const { createERC20 } = require('./ERC20')

module.exports = createERC20({
    symbol: 'TRX',
    name: 'Tron',
    color: '#000000',
    contract_address: '0xf230b790e05390fc8295f4d3f60332c93bed42e2',
    labels: 'tronix ethereum token erc20 ecr20',
    coin_decimals: 6,
    price_decimals: 2
})
