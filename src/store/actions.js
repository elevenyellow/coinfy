import React from 'react'
import { set, collect } from 'dop'
import { Coins, getCoinId } from '/api/Coins'
import { now } from '/api/time'
import { keysToRemoveWhenExporting } from '/const/state'
import routes from '/const/routes'
import styles from '/const/styles'
import { OK, ERROR, ALERT, NORMAL } from '/const/info'
import timeouts from '/const/timeouts'
import state from '/store/state'
import {
    getTotalAssets,
    getAssetsAsArray,
    generateDefaultAsset
} from '/store/getters'
import { CryptoPriceManager } from '/api/prices'
import { decimals } from '/api/numbers'
import {
    localStorageSet,
    localStorageRemove,
    openFile,
    readFile,
    downloadFile
} from '/api/browser'

export function setHref(href) {
    const collector = collect()
    state.location.href = href
    state.sideMenuOpen = false
    collector.emit()
}

export function createAsset(type, symbol, address) {
    const asset = generateDefaultAsset({ type, symbol, address })
    const asset_id = getCoinId({ symbol, address, type })
    state.assets[asset_id] = asset
    saveAssetsLocalStorage()
    setAssetsExported(false)
    fetchBalanceAsset(asset_id)
    return asset
}

export function setPublicKey(asset_id, public_key) {
    state.assets[asset_id].public_key = public_key
    saveAssetsLocalStorage()
    setAssetsExported(false)
}

export function setPrivateKey(asset_id, private_key, password) {
    const asset = state.assets[asset_id]
    set(
        asset,
        'private_key',
        Coins[asset.symbol].encrypt(private_key, password),
        { deep: false }
    )
    saveAssetsLocalStorage()
    setAssetsExported(false)
}

export function deleteAsset(asset_id) {
    const collector = collect()
    const name = state.assets[asset_id].label || state.assets[asset_id].address
    delete state.assets[asset_id]
    setHref(routes.home())
    addNotification(`Asset "${name}" has been deleted`, OK)
    saveAssetsLocalStorage()
    setAssetsExported(false)
    collector.emit()
}

export function saveAssetsLocalStorage() {
    const assets = JSON.stringify(state.assets, (key, value) => {
        key = key.toLocaleLowerCase()
        return key === 'state' ? undefined : value
    })
    localStorageSet('assets', assets, state.network)
}

export function setAssetsExported(value) {
    state.assetsExported = value
    localStorageSet('assetsExported', value, state.network)
}

export function exportAssets() {
    if (state.totalAssets > 0) {
        const data = btoa(
            JSON.stringify(state.assets, (key, value) => {
                key = key.toLocaleLowerCase()
                return keysToRemoveWhenExporting.indexOf(key) > -1
                    ? undefined
                    : value
            })
        ) // btoa
        downloadFile(data, 'YOU_MUST_RENAME_THIS_FOR_SECURITY')
        setAssetsExported(true)
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
    openFile(file => {
        readFile(file, dataString => importAssets(dataString))
    })
}

export function importAssets(dataString) {
    try {
        const assets = JSON.parse(atob(dataString)) //atob
        for (let asset_id in assets)
            assets[asset_id] = generateDefaultAsset(assets[asset_id])
        const totalAssets = getTotalAssets(assets)
        if (totalAssets > 0) {
            const collector = collect()
            state.assets = assets
            setHref(routes.home())
            addNotification(`You have imported ${totalAssets} Assets`, OK)
            saveAssetsLocalStorage()
            setAssetsExported(true)
            fetchAllBalances()
            collector.emit()
        } else
            addNotification(
                "We couldn't find any Asset to Import on this JSON file",
                ERROR
            )
    } catch (e) {
        console.error(e)
        addNotification("We couldn't parse the JSON file", ERROR)
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

export function changeNetwork(network) {
    localStorageSet('network', network)
    location.href = '/'
}

export function forceloseSession() {
    setAssetsExported(true)
    localStorageRemove('assets', state.network)
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
    localStorageSet('currency', symbol)
    fetchPrices()
    collector.emit()
}

export function updatePrice(symbol, value) {
    const collector = collect()
    state.prices[symbol] = value
    localStorageSet(symbol, decimals(value))
    collector.emit()
}

let idNotificationNotConnection
export function showNotConnectionNotification(value) {
    if (value && idNotificationNotConnection === undefined) {
        idNotificationNotConnection = addNotification(
            "Seems like you don't have internet connection",
            NORMAL,
            null
        )
    } else if (!value && idNotificationNotConnection !== undefined) {
        deleteNotification(idNotificationNotConnection)
        idNotificationNotConnection = undefined
    }
}

export function setAssetLabel(asset_id, label) {
    const collector = collect()
    state.assets[asset_id].label = label
    collector.emit()
}

export function updateBalance(asset_id, balance) {
    const asset = state.assets[asset_id]
    if (asset.balance !== balance) {
        const collector = collect()
        asset.state.shall_we_fetch_summary = true
        asset.balance = balance
        collector.emit()
        saveAssetsLocalStorage()
    }
}

// Fetchers

export function fetchAllBalances() {
    getAssetsAsArray().forEach((asset, index) => {
        setTimeout(
            () => fetchBalance(getCoinId(asset)),
            index * timeouts.between_each_getbalance
        )
    })
    setTimeout(fetchAllBalances, timeouts.update_all_balances)
}
fetchAllBalances()

export function fetchBalance(asset_id) {
    const asset = state.assets[asset_id]
    Coins[asset.symbol]
        .fetchBalance(asset.address)
        .then(balance => {
            showNotConnectionNotification(false)
            updateBalance(asset_id, balance)
            return balance
        })
        .catch(e => {
            console.error(asset.symbol, 'fetchBalance', e)
            showNotConnectionNotification(true)
        })
}

export function fetchSummaryAssetIfReady(asset_id) {
    const asset = state.assets[asset_id]
    if (asset.state.shall_we_fetch_summary && !asset.state.fetching_summary)
        return fetchSummaryAsset(asset_id)
}

export function fetchSummaryAsset(asset_id) {
    // console.log( 'fetchSummaryAsset', asset_id );
    const asset = state.assets[asset_id]
    const collector = collect()
    asset.state.fetching_summary = true
    asset.summary = {}
    collector.emit()

    return Coins[asset.symbol]
        .fetchSummary(asset.address)
        .then(summary => {
            const collector = collect()
            asset.state.fetching_summary = false
            asset.state.shall_we_fetch_summary = false
            asset.balance = summary.balance
            set(asset, 'summary', summary, { deep: false })
            collector.emit()
        })
        .catch(e => {
            asset.state.fetching_summary = false
            // asset.state.shall_we_fetch_summary = now()
            console.error(asset.symbol, 'fetchSummaryAsset', e)
        })
}

export function fetchBalanceAsset(asset_id) {
    // console.log( 'fetchSummaryAsset', asset_id );
    const asset = state.assets[asset_id]
    return Coins[asset.symbol]
        .fetchBalance(asset.address)
        .then(balance => {
            asset.balance = balance
        })
        .catch(e => {
            console.error(asset.symbol, 'fetchBalanceAsset', e)
        })
}

export const fetchPrices = (function() {
    let assetsArray = Object.keys(Coins)
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
        console.error('fetchPrices', e)
    }

    return function() {
        clearTimeout(timeout)
        manager.fetch(assetsArray, state.currency)
    }
})()
fetchPrices()
