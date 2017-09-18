import React from 'react'
import { collect } from 'dop'
import { Assets, getAssetId } from '/api/Assets'
import routes from '/const/routes'
import styles from '/const/styles'
import timeouts from '/const/timeouts'
import state from '/store/state'
import { getTotalAssets, getAssetsAsArray } from '/store/getters'
import { encryptAES128CTR } from '/api/security'
import { CryptoPriceManager } from '/api/prices'
import { decimals } from '/api/numbers'

export function setHref(href) {
    state.location.href = href
}

export function createAsset(type, symbol, address) {
    const asset = {
        type: type,
        symbol: symbol,
        address: address,
        label: '',
        balance: 0,
        state: { // this must be removed when exporting
            last_update: 0, // last time we checked balance in timestamp
            updating: false,
        }
    }
    state.assets[getAssetId({symbol,address,type})] = asset
    fetchBalance(symbol, address)
    saveAssetsLocalStorage()
    setAssetsExported(false)
    return asset
}
export function setPublicKey(asset_id, public_key) {
    state.assets[asset_id].public_key = public_key
    saveAssetsLocalStorage()
    setAssetsExported(false)
}
export function setPrivateKey(asset_id, private_key, password) {
    state.assets[asset_id].private_key = encryptAES128CTR(
        private_key,
        password
    )
    saveAssetsLocalStorage()
    setAssetsExported(false)    
}
export function deleteAsset(asset_id) {
    const collector = collect()
    const name = state.assets[asset_id].label || state.assets[asset_id].address
    delete state.assets[asset_id]
    setHref(routes.home())
    addNotification(
        `Asset "${name}" has been deleted`,
        styles.notificationColor.green
    )
    saveAssetsLocalStorage()
    setAssetsExported(false)
    collector.emit()
}

export function saveAssetsLocalStorage() {
    const assets = JSON.stringify(state.assets)
    localStorage.setItem('assets', assets)
}

export function setAssetsExported(value) {
    state.assetsExported = value
    localStorage.setItem('assetsExported', value)
}


export function exportAssets() {
    if (state.totalAssets > 0) {
        const data = btoa(localStorage.getItem('assets'))
        const a = document.createElement('a')
        const file = new Blob([data], { type: 'charset=UTF-8' }) //,
        // const date = new Date().toJSON().replace(/\..+$/,'')
        a.href = URL.createObjectURL(file)
        a.download = 'YOU_MUST_RENAME_THIS_FOR_SECURITY'
        setAssetsExported(true)
        a.click()
    }
}

export function importAssetsFromFile() {
    if (state.totalAssets > 0 && !state.assetsExported) {
        state.popups.closeSession.confirm = () => {
            state.popups.closeSession.open = false
            // setAssetsExported(true) // Not sure if should ask again after a failed import
            openImportAssetsFromFile()
        }
        state.popups.closeSession.cancel = () => {
            state.popups.closeSession.open = false
        }
        state.popups.closeSession.open = true
    } else openImportAssetsFromFile()
}

export function openImportAssetsFromFile() {
    const input = document.createElement('input')
    input.type = 'file'
    input.addEventListener('change', e => {
        const file = input.files[0]
        // if ( file.type.indexOf('json') > -1 || file.type.indexOf('text') > -1 || file.type==='' ) {
        const reader = new FileReader()
        reader.onload = e => {
            const dataString = e.target.result
            importAssets(dataString)
        }
        reader.readAsText(file)
        // }
        // else
        // addNotification('Invalid JSON file', styles.notificationColor.red)
    })
    input.click()
}

export function importAssets(dataString) {
    try {
        const assets = JSON.parse((dataString))//atob
        const totalAssets = getTotalAssets(assets)
        if (totalAssets > 0) {
            const collector = collect()
            state.assets = assets
            setHref(routes.home())
            addNotification(
                `You have imported ${totalAssets} Assets`,
                styles.notificationColor.green
            )
            saveAssetsLocalStorage()
            setAssetsExported(true)
            fetchAllBalances()
            collector.emit()
        } else
            addNotification(
                "We couldn't find any Asset to Import on this JSON file",
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
    if (state.totalAssets > 0) {
        if (!state.assetsExported) {
            state.popups.closeSession.confirm = forceloseSession
            state.popups.closeSession.cancel = () => {
                state.popups.closeSession.open = false
            }
            state.popups.closeSession.open = true
        } else forceloseSession()
    }
}

export function forceloseSession() {
    setAssetsExported(true)
    localStorage.removeItem('assets')
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

export function updateBalance(asset_id, balance) {
    const collector = collect()
    state.assets[asset_id].balance = balance
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

export function setAssetLabel(asset_id, label) {
    const collector = collect()
    state.assets[asset_id].label = label
    collector.emit()
}





// Fetchers

export function fetchAllBalances() {
    getAssetsAsArray().forEach((asset, index) => {
        setTimeout(
            () => fetchBalance(asset.symbol, asset.address),
            index * timeouts.between_each_getbalance
        )
    })
    setTimeout(fetchAllBalances, timeouts.update_all_balances)
}
fetchAllBalances()


export function fetchBalance(symbol, address) {
    Assets[symbol]
    .fetchBalance(address)
    .then(balance => {
        showNotConnectionNotification(false)
        updateBalance(getAssetId({symbol, address}), balance)
    })
    .catch(e => {
        console.error( symbol, 'fetchBalance', e )
        showNotConnectionNotification(true)
    })
}

export const fetchPrices = (function() {
    let assetsArray = Object.keys(Assets)
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
