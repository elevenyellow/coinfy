import { set } from 'dop'
import { location } from '/stores/router'
import state from '/stores/state'
import { generateRandomWallet } from '/../util/bitcoin'


export function setHref(href) {
    set(location, 'href', href)
}

export function generateBitcoinWallet() {
    const wallet = generateRandomWallet()
    set(state.view, 'address', wallet.address)
    set(state.view, 'private_key', wallet.private_key)
}