import { formatCoin } from '/api/numbers'
import {
    fetchBalance as fetchBalanceRaw,
    fetchSummary as fetchSummaryRaw,
    fetchTxs as fetchTxsRaw,
    createSimpleTxRaw,
    urlInfoRaw
} from '/api/Coins/ERC20'

export * from './ERC20'

export const symbol = 'QASH'
export const name = 'Qash'
export const color = '#1A4EE4'
export const contract_address = '0x618e75ac90b12c6049ba3b27f5d5f8651b0037f6'
export const labels = 'qahs ethereum token erc20 ecr20'
export const coin_decimals = 6
export const price_decimals = 2
export const satoshis = Math.pow(10, coin_decimals)

export function urlInfo(address) {
    return urlInfoRaw(address, contract_address)
}

export function format(value, decimals = coin_decimals) {
    return formatCoin(value, decimals, symbol)
}

export function fetchBalance(address) {
    return fetchBalanceRaw(address, contract_address, satoshis)
}

export function fetchSummary(address) {
    return fetchSummaryRaw(address, contract_address, satoshis)
}

export function fetchTxs(address, from, to) {
    return fetchTxsRaw(address, from, to, contract_address, satoshis)
}

export function createSimpleTx(params) {
    return createSimpleTxRaw(params, contract_address, coin_decimals)
}
