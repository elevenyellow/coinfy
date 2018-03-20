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
    TIMEOUT_FETCH_PRICES_TIMEOUT,
    TIMEOUT_FETCH_SUMMARY,
    TIMEOUT_UPDATE_ALL_BALANCES,
    TIMEOUT_BETWEEN_EACH_GETBALANCE,
    LOCALSTORAGE_NETWORK,
    LOCALSTORAGE_FIAT,
    LOCALSTORAGE_ASSETS,
    LOCALSTORAGE_ASSETSEXPORTED,
    LOCALSTORAGE_CUSTOMS,
    TYPE_ERC20
} from '/const/'
import routes from '/router/routes'
import styles from '/const/styles'

import { Coins } from '/api/coins'
import { createERC20 } from '/api/coins/ERC20'
import { median } from '/api/arrays'
import { getAllPrices } from '/api/prices'
import { decimals } from '/api/numbers'
import { jsonParse } from '/api/objects'
import {
    localStorageSet,
    localStorageRemove,
    localStorageGet,
    openFile,
    readFile,
    downloadFile
} from '/api/browser'

import state from '/store/state'
import {
    getTotalAssets,
    getAssetsAsArray,
    generateDefaultAsset,
    generateDefaultBackup,
    getNextCoinId,
    getAssetId,
    getSymbolsFromAssets,
    isValidAsset
} from '/store/getters'

export function fetchWrapper(promise) {
    return promise
        .then(result => {
            showNotConnectionNotification(false)
            return result
        })
        .catch(e => {
            showNotConnectionNotification(true)
            return Promise.reject(e)
        })
}

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
    saveAssetsLocalstorage()
    setAssetsExported(false)
    fetchBalanceAsset(asset_id)
    sendEventToAnalytics('createAsset', symbol)
    fetchPrices()
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
    saveAssetsLocalstorage()
    setAssetsExported(false)
}

// export function copyPrivateKey(asset_id_from, asset_id_to) {
//     const from = state.assets[asset_id_from]
//     const to = state.assets[asset_id_to]
//     set(to, 'private_key', from.private_key, { deep: false })
//     saveAssetsLocalstorage()
//     setAssetsExported(false)
// }

export function deleteAsset(asset_id) {
    const collector = collect()
    delete state.assets[asset_id]
    saveAssetsLocalstorage()
    setAssetsExported(false)
    collector.emit()
}

export function saveAssetsLocalstorage() {
    const assets = JSON.stringify(state.assets, (key, value) => {
        key = key.toLocaleLowerCase()
        return key === 'state' ? undefined : value
    })
    localStorageSet(LOCALSTORAGE_ASSETS, assets, state.network)
}

export function setAssetsExported(value) {
    // state.assetsExported = value
    localStorageSet(LOCALSTORAGE_ASSETSEXPORTED, value, state.network)
}

export function exportBackup(a_element) {
    const data = generateDefaultBackup()
    // assets
    data.assets = JSON.parse(
        JSON.stringify(state.assets, (key, value) => {
            key = key.toLocaleLowerCase()
            return KEYS_TO_REMOVE_WHEN_EXPORTING.indexOf(key) > -1
                ? undefined
                : value
        })
    )
    // custom tokens/coins
    data.customs = jsonParse(
        localStorageGet(LOCALSTORAGE_CUSTOMS, state.network)
    )
    // console.log('exportBackup', data)
    downloadFile({
        data: btoa(JSON.stringify(data)),
        a: a_element,
        name: 'YOU_MUST_RENAME_THIS_FOR_SECURITY'
    })
    setAssetsExported(true)
}

export function importBackupFromFile() {
    const assetsExported =
        localStorageGet(LOCALSTORAGE_ASSETSEXPORTED, state.network) === 'true'
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
        readFile(file, dataString => importBackup(dataString))
    })
}

export function importBackup(dataString) {
    try {
        let data = JSON.parse(atob(dataString))

        // cheking if the file imported is an old version
        if (data.v === undefined || data.network === undefined)
            data = generateDefaultBackup({ assets: data })
        // console.log('importBackup', data)

        // cheking if we are in the right mode
        if (data.network !== state.network) {
            const first = state.network === MAINNET ? 'mainnet' : 'testnet'
            const second = data.network === MAINNET ? 'mainnet' : 'testnet'
            return addNotification(
                `You are in ${first} mode and this backup is from ${second}.`,
                ERROR
            )
        }

        // importing customs
        const customs = data.customs
        for (let symbol in customs) {
            if (Coins[symbol] === undefined) {
                if (customs[symbol].type === TYPE_ERC20)
                    createCustomERC20(customs[symbol])
            }
        }

        // importing assets
        const assets = data.assets
        for (let asset_id in assets)
            if (isValidAsset(assets[asset_id]))
                assets[asset_id] = generateDefaultAsset(assets[asset_id])
        const total_assets = getTotalAssets(assets)
        if (total_assets > 0) {
            const collector = collect()
            state.assets = assets
            setHref(routes.home())
            addNotification(`You have imported ${total_assets} Assets`, OK)
            saveAssetsLocalstorage()
            setAssetsExported(true)
            fetchAllBalances()
            fetchPrices()
            collector.emit()
        } else {
            addNotification(
                "We couldn't find any Asset to Import on this JSON file",
                ERROR
            )
        }
    } catch (e) {
        console.error(e)
        addNotification("We couldn't parse the JSON file", ERROR)
    }
}

export function closeSession() {
    const assetsExported =
        localStorageGet(LOCALSTORAGE_ASSETSEXPORTED, state.network) === 'true'
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
    localStorageSet(LOCALSTORAGE_NETWORK, network)
    location.href = '/'
}

export function forceLoseSession() {
    setAssetsExported(true)
    localStorageRemove(LOCALSTORAGE_ASSETS, state.network)
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
    localStorageSet(LOCALSTORAGE_FIAT, symbol)
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
        saveAssetsLocalstorage()
    }
}

export function createCustomERC20(data) {
    const { symbol } = data
    data.type = TYPE_ERC20
    Coins[symbol] = createERC20(data)
    saveCustomLocalstorage(data)
}

export function saveCustomLocalstorage(data) {
    const coins_localstorage = jsonParse(
        localStorageGet(LOCALSTORAGE_CUSTOMS, state.network)
    )
    coins_localstorage[data.symbol] = data
    localStorageSet(
        LOCALSTORAGE_CUSTOMS,
        JSON.stringify(coins_localstorage),
        state.network
    )
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
        return Coins[asset.symbol].fetchBalance(asset.address).then(balance => {
            updateBalance(asset_id, balance)
            return balance
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
    let timeout
    return function() {
        // console.log('fetchPrices')
        // TIMEOUT_FETCH_PRICES
        clearTimeout(timeout)
        const cryptos = getSymbolsFromAssets()
        if (cryptos.length > 0)
            getAllPrices(
                cryptos,
                state.fiat,
                TIMEOUT_FETCH_PRICES_TIMEOUT
            ).then(prices => {
                // console.log('fetchPrices', prices)
                cryptos.forEach(crypto => {
                    if (prices[crypto].length > 0)
                        updatePrice(crypto, median(prices[crypto]))
                })
                timeout = setTimeout(fetchPrices, TIMEOUT_FETCH_PRICES)
            })
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
