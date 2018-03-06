const { createERC20 } = require('./ERC20')

module.exports = createERC20({
    symbol: 'MKR',
    name: 'Maker',
    color: '#4DC6AD',
    contract_address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    labels: 'marker mrk ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2
})
