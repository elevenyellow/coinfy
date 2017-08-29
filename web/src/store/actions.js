import dop, { collect } from 'dop'
import routes from '/const/routes'
import { state } from '/store/state'
import { encryptAES128CTR } from '/api/security'

export function setHref(href) {
    state.location.href = href
}

export function createWallet(symbol, address) {
    state.wallets[symbol][address] = {
        label: '',
        balance: 0,
        last_update: 0 // last time we checked balance in timestamp
    }
    updateSession()
}
export function setPublicKey(symbol, address, public_key) {
    state.wallets[symbol][address].public_key = public_key
    updateSession()
}
export function setPrivateKey(symbol, address, private_key, password) {
    state.wallets[symbol][address].private_key = encryptAES128CTR(
        private_key,
        password
    )
    updateSession()
}
export function deleteWallet(symbol, address) {
    const collector = collect()
    delete state.wallets[symbol][address]
    setHref(routes.home())
    collector.emit()
    updateSession()
}


export function updateSession() {
    const wallets = JSON.stringify(state.wallets)
    window.localStorage.setItem('wallets', wallets)
}