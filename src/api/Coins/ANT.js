import { formatCoin } from '/api/numbers'
import { fetchBalanceRaw } from '/api/Coins/ERC20'

export * from './ERC20'

export const symbol = 'ANT'
export const name = 'Aragon'
export const color = '#2cdee1'
export const coin_decimals = 18
export const price_decimals = 2
export const contract_address = '0x960b236A07cf122663c4303350609A66A7B288C0'

export function fetchBalance(address) {
    return fetchBalanceRaw(address, contract_address, coin_decimals)
}

export function format(value) {
    return formatCoin(value, coin_decimals, symbol)
}
