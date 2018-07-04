const { createERC20 } = require('./ERC20')
const { MAINNET } = require('../../const/')

module.exports = createERC20({
    symbol: 'EOS',
    name: 'EOS',
    color: '#000000',
    contract_address: '0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0',
    labels: 'eos ethereum token erc20 ecr20',
    coin_decimals: 18,
    price_decimals: 2,
    networks_availables: [MAINNET]
})
