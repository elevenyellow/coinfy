import { collect } from 'dop'
import { location, routes } from '/stores/router'
import state from '/stores/state'
import { encryptAES128CTR } from '/../util/crypto'


export function setHref(href) {
    location.href = href
}

export function BTCcreate(address) {
    state.wallets.BTC[address] = {
        version: 3, // using format of ethereum keystore
        label: '',
        balance: 0,
        last_check: 0 // last time we checked balance in timestamp
    }
}
export function BTCsetPublicKey(address, public_key) {
    state.wallets.BTC[address].public_key = public_key
}
export function BTCsetPrivateKey(address, private_key, password) {
    state.wallets.BTC[address].private_key = encryptAES128CTR(private_key, password)
}