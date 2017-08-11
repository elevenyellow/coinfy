import { set } from 'dop'
import { location } from '/stores/router'
import state from '/stores/state'
import bitcoin from 'bitcoinjs-lib'

export function setHref(href) {
    set(location, 'href', href)
}

export function setInitialViewState(view_state) {
    set(state, 'view', view_state)
}

export function generateBitcoinWallet(view_state) {
    const wallet = bitcoin.ECPair.makeRandom()
    set(state.view, 'address', wallet.getAddress())
    set(state.view, 'privatekey', wallet.toWIF())
}