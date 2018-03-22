import { computed, register, createObserver } from 'dop'
import { createLocation } from 'dop-router/location'
import { USD } from '/api/fiats'
import { getTotalAssets } from '/store/getters'
import restoreFromLocalStorage from '/store/restore'
import { localStorageGet, locationHref } from '/api/browser'
import {
    MAINNET,
    TESTNET,
    LOCALSTORAGE_NETWORK,
    LOCALSTORAGE_FIAT
} from '/const/'

// initial state
const network = Number(localStorageGet(LOCALSTORAGE_NETWORK)) || MAINNET
const state = register({
    // Data
    network: network,
    fiat: localStorageGet(LOCALSTORAGE_FIAT) || USD.symbol,
    // assetsExported: loccdalStorageGet('assetsExported', network) !== 'false',
    assets: {},
    prices: {},
    totalAssets: computed(function() {
        // console.log('recalculating totalAssets...')
        return getTotalAssets(this.assets)
    }),
    balance: computed(function() {
        let total = 0
        let asset
        let totalAssets = this.totalAssets
        Object.keys(this.assets).forEach(asset_id => {
            asset = this.assets[asset_id]
            if (asset)
                total += (this.prices[asset.symbol] || 0) * (asset.balance || 0)
        })
        // console.log('recalculating balance...', totalAssets, total)
        return total
    }),

    // UI
    menuOpen: false,
    sideMenuOpen: false,
    view: {},
    notifications: {},
    popups: {
        closeSession: {
            open: false
        }
    }
})

// restoring data and config from localstorage
restoreFromLocalStorage(state)

// implementing location router (special object)
createLocation(locationHref(), state, 'location')

export default state
