import { register } from 'dop'
import { create } from '/doprouter/core'
import { BTC } from '/const/crypto'

export const state = register({
    wallets: {
        [BTC.symbol]: {}
    },
    view: {}
})

create(window.location.href, state)

export function getWallet(symbol, address) {
    return state.wallets[symbol][address]
}

export function isWalletRegistered(symbol, address) {
    return state.wallets[symbol].hasOwnProperty(address)
}

export function isWalletWithPrivateKey(symbol, address) {
    return (
        isWalletRegistered(symbol, address) &&
        state.wallets[symbol][address].hasOwnProperty('private_key')
    )
}
