import { cryptos, BTC } from '/const/cryptos'
import state from '/store/state'
import { decryptAES128CTR } from '/api/security'
import { isPrivateKey, getAddressFromPrivateKey } from '/api/btc'

// GETTERS
export function getTotalWallets(wallets) {
    let total = 0
    Object.keys(cryptos).forEach(crypto=>{
        if (typeof wallets[crypto] == 'object')
            total += Object.keys(wallets[crypto]).length
    })
    return total
}


export function getWallet(symbol, address) {
    return state.wallets[symbol][address]
}

export function isWalletRegistered(symbol, address) {
    return (
        state.wallets.hasOwnProperty(symbol) &&
        state.wallets[symbol].hasOwnProperty(address)
    )
}

export function isWalletWithPrivateKey(symbol, address) {
    return (
        isWalletRegistered(symbol, address) &&
        state.wallets[symbol][address].hasOwnProperty('private_key')
    )
}

export function unlockBTCWallet(address, password) {
    const private_key = decryptAES128CTR(
        getWallet(BTC.symbol, address).private_key,
        password
    )

    if ( isPrivateKey(private_key) ) {
        if ( getAddressFromPrivateKey(private_key)===address )
            return private_key
    }

    return false
}


export function getWalletsAsArray() {
    const wallets = []
    let wallet
    Object.keys(state.wallets).forEach(symbol => {
        Object.keys(state.wallets[symbol]).forEach(address => {
            wallet = {
                symbol: symbol,
                address: address,
                wallet: state.wallets[symbol][address]
            }
            wallets.push(wallet)
        })
    })
    return wallets
}