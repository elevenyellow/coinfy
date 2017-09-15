import React from 'react'
import { collect } from 'dop'
import { assets } from '/api/assets'
import routes from '/const/routes'
import styles from '/const/styles'
import timeouts from '/const/timeouts'
import state from '/store/state'
import { getTotalWallets, getWalletsAsArray } from '/store/getters'
import { encryptAES128CTR } from '/api/security'
import { CryptoPriceManager } from '/api/prices'
import { decimals } from '/api/numbers'

export function setHref(href) {
    state.location.href = href
}

export function createWallet(symbol, address) {
    state.wallets[symbol][address] = {
        label: '',
        balance: 0,
        state: { // this must be removed when exporting
            last_update: 0, // last time we checked balance in timestamp
        }
    }
    fetchBalance(symbol, address)
    updateSession()
    setWalletsExported(false)
}
export function setPublicKey(symbol, address, public_key) {
    state.wallets[symbol][address].public_key = public_key
    updateSession()
    setWalletsExported(false)
}
export function setPrivateKey(symbol, address, private_key, password) {
    state.wallets[symbol][address].private_key = encryptAES128CTR(
        private_key,
        password
    )
    updateSession()
    setWalletsExported(false)    
}
export function deleteWallet(symbol, address) {
    const collector = collect()
    const name = state.wallets[symbol][address].label || address
    delete state.wallets[symbol][address]
    setHref(routes.home())
    addNotification(
        `Wallet "${name}" has been deleted`,
        styles.notificationColor.green
    )
    updateSession()
    setWalletsExported(false)
    collector.emit()
}

export function updateSession() {
    const wallets = JSON.stringify(state.wallets)
    localStorage.setItem('wallets', wallets)
}

export function setWalletsExported(value) {
    state.walletsExported = value
    localStorage.setItem('walletsExported', value)
}


export function exportWallets() {
    if (state.totalWallets > 0) {
        const data = btoa(localStorage.getItem('wallets'))
        const a = document.createElement('a')
        const file = new Blob([data], { type: 'charset=UTF-8' }) //,
        // const date = new Date().toJSON().replace(/\..+$/,'')
        a.href = URL.createObjectURL(file)
        a.download = 'YOU_MUST_RENAME_THIS_FOR_SECURITY'
        setWalletsExported(true)
        a.click()
    }
}

export function importWalletsFromFile() {
    if (state.totalWallets > 0 && !state.walletsExported) {
        state.popups.closeSession.confirm = () => {
            state.popups.closeSession.open = false
            // setWalletsExported(true) // Not sure if should ask again after a failed import
            openImportWalletsFromFile()
        }
        state.popups.closeSession.cancel = () => {
            state.popups.closeSession.open = false
        }
        state.popups.closeSession.open = true
    } else openImportWalletsFromFile()
}

export function openImportWalletsFromFile() {
    const input = document.createElement('input')
    input.type = 'file'
    input.addEventListener('change', e => {
        const file = input.files[0]
        // if ( file.type.indexOf('json') > -1 || file.type.indexOf('text') > -1 || file.type==='' ) {
        const reader = new FileReader()
        reader.onload = e => {
            const dataString = e.target.result
            importWallets(dataString)
        }
        reader.readAsText(file)
        // }
        // else
        // addNotification('Invalid JSON file', styles.notificationColor.red)
    })
    input.click()
}

export function importWallets(dataString) {
    try {
        const wallets = JSON.parse(atob(dataString))
        const totalWallets = getTotalWallets(wallets)
        if (totalWallets > 0) {
            const collector = collect()
            state.wallets = wallets
            setHref(routes.home())
            addNotification(
                `You have imported ${totalWallets} Wallets`,
                styles.notificationColor.green
            )
            updateSession()
            setWalletsExported(true)
            fetchAllBalances()
            collector.emit()
        } else
            addNotification(
                "We couldn't find any Wallet to Import on this JSON file",
                styles.notificationColor.red
            )
    } catch (e) {
        console.error(e)
        addNotification(
            "We couldn't parse the JSON file",
            styles.notificationColor.red
        )
    }
}

export function closeSession() {
    if (state.totalWallets > 0) {
        if (!state.walletsExported) {
            state.popups.closeSession.confirm = forceloseSession
            state.popups.closeSession.cancel = () => {
                state.popups.closeSession.open = false
            }
            state.popups.closeSession.open = true
        } else forceloseSession()
    }
}

export function forceloseSession() {
    setWalletsExported(true)
    localStorage.removeItem('wallets')
    location.href = '/'
}

let idNotification = 0
export function addNotification(text, color, timeout = 5000) {
    state.notifications[idNotification] = {
        id: idNotification,
        text: text,
        color: color,
        timeout: timeout
    }
    return idNotification++
}

export function deleteNotification(id) {
    delete state.notifications[id]
}

export function changeCurrency(symbol) {
    const collector = collect()
    state.currency = symbol
    localStorage.setItem('currency', symbol)
    fetchPrices()
    collector.emit()
}

export function updatePrice(symbol, value) {
    const collector = collect()
    state.prices[symbol] = value
    localStorage.setItem(symbol, decimals(value))
    collector.emit()
}

export function updateBalance(symbol, address, balance) {
    const collector = collect()
    state.wallets[symbol][address].balance = balance
    collector.emit()
}

let idNotificationNotConnection
export function showNotConnectionNotification(value) {
    if (value && idNotificationNotConnection===undefined) {
        idNotificationNotConnection = addNotification(
            "Seems like you don't have internet connection",
            styles.notificationColor.grey,
            null
        )
    }
    else if (!value && idNotificationNotConnection!==undefined) {
        deleteNotification(idNotificationNotConnection)
        idNotificationNotConnection = undefined
    }
}







// Fetchers

export function fetchAllBalances() {
    getWalletsAsArray().forEach((wallet, index) => {
        setTimeout(
            () => fetchBalance(wallet.symbol, wallet.address),
            index * timeouts.between_each_getbalance
        )
    })
    setTimeout(fetchAllBalances, timeouts.update_all_balances)
}
fetchAllBalances()


export function fetchBalance(symbol, address) {
    assets[symbol]
    .fetchBalance(address)
    .then(balance => {
        showNotConnectionNotification(false)
        updateBalance(symbol, address, balance)
    })
    .catch(e => {
        console.error( symbol, 'fetchBalance', e )
        showNotConnectionNotification(true)
    })
}

export const fetchPrices = (function() {
    let assetsArray = Object.keys(assets)
    let timeout
    let manager = new CryptoPriceManager()
    manager.onUpdate = function(crypto, value, source) {
        showNotConnectionNotification(false)
        // console.log( 'onUpdate', crypto, value, source );
    }
    manager.onFinish = (crypto, values) => {
        // console.log( 'onFinish', crypto, values )
        if (values.length > 0) {
            const value =
                values.reduce((sum, a) => {
                    return sum + a
                }, 0) / values.length
            updatePrice(crypto, value)
        }
    }
    manager.onFinishAll = () => {
        // console.log( 'onFinishAll', manager.prices.BTC )
        timeout = setTimeout(fetchPrices, timeouts.fetch_prices)
    }
    manager.onError = e => {
        showNotConnectionNotification(true)
        console.log( 'fetchPrices', e )
    }

    return function() {
        clearTimeout(timeout)
        manager.fetch(assetsArray, state.currency)
    }
})()
fetchPrices()
