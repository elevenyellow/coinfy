const { createERC20 } = require('./ERC20')

module.exports = createERC20({
    symbol: 'DAI',
    name: 'Dai',
    color: '#EDB34F',
    contract_address: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
    labels: 'dai maker day stable ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2
})
