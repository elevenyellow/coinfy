const { createERC20 } = require('./ERC20')
const { MAINNET } = require('../../const/')

module.exports = createERC20({
    symbol: 'SNT',
    name: 'Status Network',
    color: '#5C71EB',
    contract_address: '0x744d70fdbe2ba4cf95131626614a1763df805b9e',
    labels: 'stn ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2,
    networks_availables: [MAINNET]
})
