import { set, collect } from 'dop'
import { location, routes } from '/stores/router'
import state from '/stores/state'
import wallets from '/stores/wallets'


export function setHref(href) {
    set(location, 'href', href)
}

export function addWalletBtc(address, private_key) {
    let collector = collect()
    set(wallets.BTC, 'address', {
        v: 3, // version
        label: '',
        private_key: private_key
    })
    setHref(routes.wallet('BTC', address))
    collector.emit()
}