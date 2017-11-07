import * as btc from '/api/Assets/BTC'
import * as eth from '/api/Assets/ETH'


export const Assets = {
    BTC: btc,
    ETH: eth,
}

export const BTC = btc
export const ETH = eth



export function getAssetId({symbol, address, type='wallet'}) {
    return `${symbol}-${address}`
}