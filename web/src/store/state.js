import { register, createObserver } from 'dop'
import { create } from '/doprouter/core'
import { cryptos, BTC } from '/const/cryptos'
import { decryptAES128CTR } from '/api/security'
import { isPrivateKey, getAddressFromPrivateKey } from '/api/btc'


// initial state
const initialState = {
    menuOpen: false,
    notifications: {},
    view: {},
    walletsExported: true,
    wallets: {
        [BTC.symbol]: {}
    }
}


// restoring wallets
try {
    let wallets = window.localStorage.getItem('wallets')
    wallets = JSON.parse(wallets)
    if (wallets && typeof wallets == 'object')
        initialState.wallets = wallets
} catch(e) {}


// exporting
export const state = register(initialState)


// totalWallets
const updateTotalWallets = () => state.totalWallets = getTotalWallets(state.wallets)
updateTotalWallets()
const observer = createObserver(updateTotalWallets)
observer.observe(state, 'wallets')
Object.keys(cryptos).forEach(crypto=>{
    observer.observe(state.wallets[crypto])
})


// implementing location router (special object)
create(window.location.href, state)










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
