import { register } from 'dop'
import { create } from '/doprouter/core'
import { BTC } from '/const/crypto'
import { decryptAES128CTR } from '/api/security'
import { isPrivateKey, getAddressFromPrivateKey } from '/api/btc'



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

// initial state
const initialState = {
    wallets: {
        [BTC.symbol]: {}
    },
    view: {}
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


// implementing location router (special object)
create(window.location.href, state)