import { register } from 'dop'
import { BTC } from '/const/crypto'

export const state = register({
    wallets: {
        [BTC.symbol]: {}
    },
    view: {}
})

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
