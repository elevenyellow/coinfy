const { createERC20 } = require('./ERC20')

module.exports = createERC20({
    symbol: 'REQ',
    name: 'Request Network',
    color: '#6EE7D5',
    contract_address: '0x8f8221afbb33998d8584a2b05749ba73c37a938a',
    labels: 'rec rek ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2
})
