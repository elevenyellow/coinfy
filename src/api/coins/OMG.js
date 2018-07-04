const { createERC20 } = require('./ERC20')
const { MAINNET } = require('../../const/')

module.exports = createERC20({
    symbol: 'OMG',
    name: 'OmiseGo',
    color: '#2159EC',
    contract_address: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
    labels: 'omg ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2,
    networks_availables: [MAINNET]
})
