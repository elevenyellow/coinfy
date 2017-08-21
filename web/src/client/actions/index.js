import { set, collect } from 'dop'
import { location, routes } from '/stores/router'
import state from '/stores/state'
import wallets from '/stores/wallets'
import { encryptAES128CTR } from '/../util/crypto'


export function setHref(href) {
    set(location, 'href', href)
    console.log( JSON.stringify(wallets.BTC) );
}

export function BTCcreate(address) {
    set(wallets.BTC, address, {
        v: 3, // version
        label: ''
    })
}
export function BTCsetPublicKey(address, public_key) {
    set(wallets.BTC[address], 'public_key', public_key)
}
export function BTCsetPrivateKey(address, private_key, password) {
    set(wallets.BTC[address], 'private_key', encryptAES128CTR(private_key, password))
}