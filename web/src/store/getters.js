import { util } from 'dop'
import { Assets } from '/api/Assets'
import { isPrivateKey, getAddressFromPrivateKey } from '/api/Assets/BTC'
import state from '/store/state'

// GETTERS
export function getTotalAssets(assets) {
    return Object.keys(assets).length
}

export function convertBalance(symbol, balance) {
    return state.prices[symbol] * (balance||0)
}

export function getAsset(asset_id) {
    return state.assets[asset_id]
}

export function isAssetRegistered(asset_id) {
    return (
        state.assets.hasOwnProperty(asset_id)
    )
}

export function isAssetWithPrivateKey(asset_id) {
    return (
        isAssetRegistered(asset_id) &&
        state.assets[asset_id].hasOwnProperty('private_key')
    )
}



export function getAssetsAsArray() {
    const assets = []
    Object.keys(state.assets).forEach(asset_id => {
        assets.push(state.assets[asset_id])
    })
    return assets
}


export function generateDefaultAsset(object={}) {
    const asset = {
        // type: type,
        // symbol: symbol,
        // address: address,
        label: '',
        balance: 0,
        printed: false, // wallet printed?
        state: { // this must be removed when exporting or saving in localstorage
            shall_we_fetch_summary: true,
            fetching_summary: false
        },
        summary: { // summary data, must be removed when exporting

        }
    }

    return util.merge(asset, object)
}