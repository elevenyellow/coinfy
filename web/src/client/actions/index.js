import { set } from 'dop'
import bitcoin from 'bitcoinjs-lib'
// import cipher from 'browserify-cipher'
// import bignumber from 'bignumber.js'
import { location } from '/stores/router'
import state from '/stores/state'


export function setHref(href) {
    set(location, 'href', href)
}

export function generateBitcoinWallet(view_state) {
    const wallet = bitcoin.ECPair.makeRandom()
    set(state.view, 'address', wallet.getAddress())
    set(state.view, 'privatekey', wallet.toWIF())
}