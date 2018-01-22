import { formatCoin } from '/api/numbers'
import {
    fetchBalance as fetchBalanceRaw,
    fetchSummary as fetchSummaryRaw,
    fetchTxs as fetchTxsRaw,
    createSimpleTxRaw,
    urlInfoRaw
} from '/api/Coins/ERC20'

export * from './ERC20'

export const symbol = 'KNC'
export const name = 'Kyber Network'
export const color = '#61B0A3'
export const contract_address = '0xdd974d5c2e2928dea5f71b9825b8b646686bd200'
export const labels = 'kcn eth token erc20 ecr20'
export const coin_decimals = 8
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
