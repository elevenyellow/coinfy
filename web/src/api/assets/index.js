import * as btc from '/api/Assets/BTC'
import * as bch from '/api/Assets/BCH'


export const Assets = {
    BTC: btc,
    // BCH: bch,
}

export const BTC = btc
export const BCH = bch



export function getAssetId(symbol, address, type='wallet') {
    return `${symbol}-${address}`
}