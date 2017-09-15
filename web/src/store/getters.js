import { Assets } from '/api/Assets'
import { isPrivateKey, getAddressFromPrivateKey } from '/api/Assets/BTC'
import state from '/store/state'
import { decryptAES128CTR } from '/api/security'

// GETTERS
export function getTotalWallets(assets) {
    let total = 0
    Object.keys(Assets).forEach(crypto=>{
        if (typeof assets[crypto] == 'object')
            total += Object.keys(assets[crypto]).length
    })
    return total
}


export function convertBalance(symbol, balance) {
    return state.prices[symbol] * (balance||0)
}

export function getWallet(symbol, address) {
    return state.assets[symbol][address]
}

export function isWalletRegistered(symbol, address) {
    return (
        state.assets.hasOwnProperty(symbol) &&
        state.assets[symbol].hasOwnProperty(address)
    )
}

export function isWalletWithPrivateKey(symbol, address) {
    return (
        isWalletRegistered(symbol, address) &&
        state.assets[symbol][address].hasOwnProperty('private_key')
    )
}

export function unlockBTCWallet(address, password) {
    const private_key = decryptAES128CTR(
        getWallet(assetsBTC.symbol, address).private_key,
        password
    )

    if ( isPrivateKey(private_key) ) {
        if ( getAddressFromPrivateKey(private_key)===address )
            return private_key
    }

    return false
}


export function getWalletsAsArray() {
    const assets = []
    let wallet
    Object.keys(state.assets).forEach(symbol => {
        Object.keys(state.assets[symbol]).forEach(address => {
            wallet = {
                symbol: symbol,
                address: address,
                wallet: state.assets[symbol][address]
            }
            assets.push(wallet)
        })
    })
    return assets
}