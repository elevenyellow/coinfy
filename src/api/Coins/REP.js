const { createERC20 } = require('./ERC20')

module.exports = createERC20({
    symbol: 'REP',
    name: 'Augur',
    color: '#5E2851',
    contract_address: '0xe94327d07fc17907b4db788e5adf2ed424addff6',
    labels: 'rpe agur ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2
})
