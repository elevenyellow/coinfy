import { Assets } from '/api/Assets'
import { isPrivateKey, getAddressFromPrivateKey } from '/api/Assets/BTC'
import state from '/store/state'
import { decryptAES128CTR } from '/api/security'

// GETTERS
export function getTotalAssets(assets) {
    return Object.keys(assets).length
}

export function convertBalance(symbol, balance) {
    return state.prices[symbol] * (balance||0)
}

export function getAsset(symbol, address) {
    return state.assets[symbol][address]
}

export function isAssetRegistered(symbol, address) {
    return (
        state.assets.hasOwnProperty(symbol) &&
        state.assets[symbol].hasOwnProperty(address)
    )
}

export function isAssetWithPrivateKey(symbol, address) {
    return (
        isAssetRegistered(symbol, address) &&
        state.assets[symbol][address].hasOwnProperty('private_key')
    )
}

export function unlockBTCAsset(address, password) {
    const private_key = decryptAES128CTR(
        getAsset(assetsBTC.symbol, address).private_key,
        password
    )

    if ( isPrivateKey(private_key) ) {
        if ( getAddressFromPrivateKey(private_key)===address )
            return private_key
    }

    return false
}


export function getAssetsAsArray() {
    const assets = []
    Object.keys(state.assets).forEach(asset_id => {
        assets.push(state.assets[asset_id])
    })
    return assets
}