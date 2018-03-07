import { computed, register, createObserver } from 'dop'
import { create } from 'dop-router/location'
import { Coins } from '/api/coins'
import { Fiats, USD } from '/api/fiats'
import { getTotalAssets, generateDefaultAsset } from '/store/getters'
import { localStorageGet } from '/api/browser'
import { MAINNET, TESTNET } from '/const/'

// initial state
const network = Number(localStorageGet('network')) || MAINNET
const initialState = {
    // Data
    network: network,
    fiat: localStorageGet('fiat') || USD.symbol,
    // assetsExported: loccdalStorageGet('assetsExported', network) !== 'false',
    assets: {},
    prices: {},
    totalAssets: 0,
    balance: computed(function() {
        let total = 0
        let asset
        let totalAssets = this.totalAssets
        Object.keys(this.assets).forEach(asset_id => {
            asset = this.assets[asset_id]
            if (asset)
                total += (this.prices[asset.symbol] || 0) * (asset.balance || 0)
        })
        // console.log( 'recalculating balance...', totalAssets, total )
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
}

// restoring price from storage
const assetsArray = Object.keys(Coins)
assetsArray.forEach(symbol => {
    if (localStorageGet(symbol) !== null)
        initialState.prices[symbol] = Number(localStorageGet(symbol))
})

// restoring assets from storage
try {
    let assets = localStorageGet('assets', network)
    assets = JSON.parse(assets)
    if (assets && typeof assets == 'object') {
        initialState.assets = assets
        for (let asset_id in assets)
            assets[asset_id] = generateDefaultAsset(assets[asset_id])
    }
} catch (e) {
    console.error('restoring assets from storage', e)
}

// registering
const state = register(initialState)

// totalAssets autoupdate
const updateTotalAssets = m =>
    (state.totalAssets = getTotalAssets(state.assets))
updateTotalAssets()
const observer = createObserver(updateTotalAssets)
observer.observe(state, 'assets')
observer.observe(state.assets)

// implementing location router (special object)
create(window.location.href, state, 'location')

export default state
