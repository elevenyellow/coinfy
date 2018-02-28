import React from 'react'
import { set, collect } from 'dop'

import {
    MAINNET,
    KEYS_TO_REMOVE_WHEN_EXPORTING,
    OK,
    ERROR,
    ALERT,
    NORMAL,
    TIMEOUT_FETCH_PRICES,
    TIMEOUT_FETCH_SUMMARY,
    TIMEOUT_UPDATE_ALL_BALANCES,
    TIMEOUT_BETWEEN_EACH_GETBALANCE
} from '/const/'
import routes from '/router/routes'
import styles from '/const/styles'

import { Coins } from '/api/Coins'
import { now } from '/api/time'

import state from '/store/state'
import {
    getTotalAssets,
    getAssetsAsArray,
    generateDefaultAsset,
    getNextCoinId,
    getAssetId
} from '/store/getters'
import { CryptoPriceManager } from '/api/prices'
import { decimals } from '/api/numbers'
import {
    localStorageSet,
    localStorageRemove,
    localStorageGet,
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
    const collector = collect()
    const asset = generateDefaultAsset({ type, symbol, address })
    const asset_id = getNextCoinId({ symbol, address })
    state.assets[asset_id] = asset
    saveAssetsLocalStorage()
    setAssetsExported(false)
    fetchBalanceAsset(asset_id)
    sendEventToAnalytics('createAsset', symbol)
    collector.emit()
    return asset
}

export function setPrivateKey(asset_id, private_key, password) {
    return setPrivateKeyOrSeed(asset_id, private_key, password, false)
}

export function setSeed(asset_id, seed, password) {
    return setPrivateKeyOrSeed(asset_id, seed, password, true)
}

export function setPrivateKeyOrSeed(asset_id, key, password, is_seed) {
    const asset = state.assets[asset_id]
    set(
        asset,
        is_seed ? 'seed' : 'private_key',
        Coins[asset.symbol][is_seed ? 'encryptSeed' : 'encryptPrivateKey'](
            key,
            password
        ),
        { deep: false }
    )
    saveAssetsLocalStorage()
    setAssetsExported(false)
}

// export function copyPrivateKey(asset_id_from, asset_id_to) {
//     const from = state.assets[asset_id_from]
//     const to = state.assets[asset_id_to]
//     set(to, 'private_key', from.private_key, { deep: false })
//     saveAssetsLocalStorage()
//     setAssetsExported(false)
// }

export function deleteAsset(asset_id) {
    const collector = collect()
    delete state.assets[asset_id]
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
    // state.assetsExported = value
    localStorageSet('assetsExported', value, state.network)
}

export function exportAssets(a) {
    if (state.totalAssets > 0) {
        const data = btoa(
            JSON.stringify(state.assets, (key, value) => {
                key = key.toLocaleLowerCase()
                return KEYS_TO_REMOVE_WHEN_EXPORTING.indexOf(key) > -1
                    ? undefined
                    : value
            })
        ) // btoa
        downloadFile({ data, a, name: 'YOU_MUST_RENAME_THIS_FOR_SECURITY' })
        setAssetsExported(true)
    }
}

export function importAssetsFromFile() {
    const assetsExported =
        localStorageGet('assetsExported', state.network) === 'true'
    if (state.totalAssets > 0 && !assetsExported) {
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
    const assetsExported =
        localStorageGet('assetsExported', state.network) === 'true'
    if (state.totalAssets > 0) {
        if (!assetsExported) {
            state.popups.closeSession.confirm = forceLoseSession
            state.popups.closeSession.cancel = () => {
                state.popups.closeSession.open = false
            }
            state.popups.closeSession.open = true
        } else forceLoseSession()
    }
}

export function changeNetwork(network) {
    localStorageSet('network', network)
    location.href = '/'
}

export function forceLoseSession() {
    setAssetsExported(true)
    localStorageRemove('assets', state.network)
    location.href = '/'
}

let idNotification = 0
export function addNotification(text, color = OK, timeout = 6000) {
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

export function changeFiat(symbol) {
    const collector = collect()
    state.fiat = symbol
    localStorageSet('fiat', symbol)
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
            () => fetchBalance(getAssetId(asset)),
            index * TIMEOUT_BETWEEN_EACH_GETBALANCE
        )
    })
    setTimeout(fetchAllBalances, TIMEOUT_UPDATE_ALL_BALANCES)
}
fetchAllBalances()

export function fetchBalance(asset_id) {
    const asset = state.assets[asset_id]
    if (asset !== undefined) {
        return Coins[asset.symbol]
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
        timeout = setTimeout(fetchPrices, TIMEOUT_FETCH_PRICES)
    }
    manager.onError = e => {
        showNotConnectionNotification(true)
        console.error('fetchPrices', e)
    }

    return function() {
        clearTimeout(timeout)
        manager.fetch(assetsArray, state.fiat)
    }
})()
fetchPrices()

export function sendEventToAnalytics() {
    if (
        state.network === MAINNET &&
        typeof ga == 'function' &&
        location.href.indexOf('coinfy.com') === 8
    ) {
        const args = Array.prototype.slice.call(arguments, 0)
        args.unshift('send', 'event')
        ga.apply(this, args)
    }
}
