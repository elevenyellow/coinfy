import { collect } from 'dop'
import { location, routes } from '/stores/router'
import { state } from '/stores/state'
import { encryptAES128CTR } from '/util/crypto'

export function setHref(href) {
    location.href = href
}

export function createWallet(symbol, address) {
    state.wallets[symbol][address] = {
        label: '',
        balance: 0,
        last_update: 0 // last time we checked balance in timestamp
    }
}
export function setPublicKey(symbol, address, public_key) {
    state.wallets[symbol][address].public_key = public_key
}
export function setPrivateKey(symbol, address, private_key, password) {
    state.wallets[symbol][address].private_key = encryptAES128CTR(
        private_key,
        password
    )
}
