import { formatCoin } from '/api/numbers'
import { fetchBalanceRaw, urlInfoRaw } from '/api/Coins/ERC20'

export * from './ERC20'

export const symbol = 'ANT'
export const name = 'Aragon'
export const etherscan_handler = 'Aragon'
export const color = '#2cdee1'
export const coin_decimals = 18
export const price_decimals = 2
export const contract_address = '0x960b236a07cf122663c4303350609a66a7b288c0'

export function urlInfo(address) {
    return urlInfoRaw(address, etherscan_handler)
}

export function fetchBalance(address) {
    return fetchBalanceRaw(address, contract_address, coin_decimals)
}

export function format(value, decimals = coin_decimals) {
    return formatCoin(value, decimals, symbol)
}
