import { computed, register, createObserver } from 'dop'
import { create } from 'dop-router/location'
import { Coins } from '/api/coins'
import { createERC20 } from '/api/coins/ERC20'
import { Fiats, USD } from '/api/fiats'
import {
    getTotalAssets,
    generateDefaultAsset,
    getSymbolsFromAssets
} from '/store/getters'
import { jsonParse } from '/api/objects'
import { localStorageGet } from '/api/browser'
import {
    MAINNET,
    TESTNET,
    LOCALSTORAGE_NETWORK,
    LOCALSTORAGE_FIAT,
    LOCALSTORAGE_ASSETS,
    LOCALSTORAGE_ASSETSEXPORTED,
    LOCALSTORAGE_CUSTOMS
} from '/const/'

// initial state
const network = Number(localStorageGet(LOCALSTORAGE_NETWORK)) || MAINNET
const initialState = {
    // Data
    network: network,
    fiat: localStorageGet(LOCALSTORAGE_FIAT) || USD.symbol,
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

// restoring assets from localstorage
try {
    const assets = jsonParse(localStorageGet(LOCALSTORAGE_ASSETS, network))
    initialState.assets = assets
    for (let asset_id in assets)
        assets[asset_id] = generateDefaultAsset(assets[asset_id])
} catch (e) {
    console.error('restoring assets from localstorage', e)
}

// restoring price from localstoragestorage
const assetsArray = getSymbolsFromAssets(initialState.assets)
assetsArray.forEach(symbol => {
    if (localStorageGet(symbol) !== null)
        initialState.prices[symbol] = Number(localStorageGet(symbol))
})

// restoring custom coins/tokens created by user from localstorage
try {
    const cryptos = jsonParse(localStorageGet(LOCALSTORAGE_CUSTOMS, network))
    for (let symbol in cryptos) Coins[symbol] = createERC20(cryptos[symbol])
} catch (e) {
    console.error('restoring custom tokens from localstorage', e)
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
