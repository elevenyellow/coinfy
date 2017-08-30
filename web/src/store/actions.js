import React from 'react'
import { collect } from 'dop'
import routes from '/const/routes'
import styles from '/const/styles'
import { state, getTotalWallets } from '/store/state'
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
    const name = state.wallets[symbol][address].label || address
    delete state.wallets[symbol][address]
    setHref(routes.home())
    addNotification(`Wallet "${name}" has been deleted`, styles.notificationColor.green)
    updateSession()
    collector.emit()
}


export function updateSession() {
    const wallets = JSON.stringify(state.wallets)
    state.walletsExported = false
    window.localStorage.setItem('wallets', wallets)
}


export function exportWallets() {
    if (state.totalWallets > 0) {
        const wallets = JSON.stringify(state.wallets)
        const a = document.createElement('a')
        const file = new Blob([wallets], {type: 'application/json;charset=UTF-8'})
        const date = new Date().toJSON().replace(/\..+$/,'')
        a.href = URL.createObjectURL(file)
        a.download = `WEDONTNEEDBANKS_backup--${date}.json`
        state.walletsExported = true
        a.click()
    }
}


export function importWalletsFromFile() {
    if (state.totalWallets>0 && !state.walletsExported)
        return alert('You must export your wallets')
    
    const input = document.createElement('input')
    input.type = 'file'
    input.addEventListener('change', e=>{
        const file = input.files[0]
        if ( file.type.indexOf('json') > -1 || file.type.indexOf('text') > -1 || file.type==='' ) {
            const reader = new FileReader()
            reader.onload = e => {
                const dataString = e.target.result
                importWallets(dataString)
            }
            reader.readAsText(file)
        }
        else
            addNotification('Invalid JSON file', styles.notificationColor.red)
    })
    input.click()
}


export function importWallets(dataString) {
    try {
        const wallets = JSON.parse(dataString)
        const totalWallets = getTotalWallets(wallets)
        if (totalWallets > 0) {
            const collector = collect()
            state.wallets = wallets
            setHref(routes.home())
            addNotification(`You have imported ${totalWallets} Wallets`, styles.notificationColor.green)
            updateSession()
            state.walletsExported = true
            collector.emit()
        }
        else
            addNotification('We couldn\'t find any Wallet to Import on this JSON file', styles.notificationColor.red)
        
    } catch(e) { 
        console.log( e );
        addNotification('We couldn\'t parse the JSON file', styles.notificationColor.red)
    }
}

export function closeSession() {
    if (state.totalWallets > 0) {
        
        if (!state.walletsExported)
            return alert('You must export your wallets')

        window.localStorage.removeItem('wallets')
        window.location.href = '/'
    }
}

let idNotification = 1
export function addNotification(text, color, timeout=7500) {
    state.notifications[idNotification] = {
        id: idNotification,
        text: text,
        color: color,
        timeout: timeout
    }
    idNotification += 1
    return idNotification
}

export function removeNotification(id) {
    delete state.notifications[id]
}
