import * as btc from '/api/Coins/BTC'
import * as eth from '/api/Coins/ETH'

export const Coins = {
    BTC: btc,
    ETH: eth,
    ANT: {}
}

export const BTC = btc
export const ETH = eth

export function getCoinId({ symbol, address, type = 'wallet' }) {
    return `${symbol}-${address}`
}
