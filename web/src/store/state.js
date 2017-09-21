import { computed, register, createObserver } from 'dop'
import { create } from '/doprouter/core'
import { Assets } from '/api/Assets'
import { currencies, USD } from '/const/currencies'
import { getTotalAssets, generateDefaultAsset } from '/store/getters'


// initial state
const initialState = {
    // Data
    prices: {},
    currency: localStorage.getItem('currency') || USD.symbol,
    assetsExported: localStorage.getItem('assetsExported') !== 'false',
    assets: {},
    totalAssets: 0,
    balance: computed(function() {
        let total = 0
        let asset
        let totalAssets = this.totalAssets
        Object.keys(this.assets).forEach(asset_id => {
            asset = this.assets[asset_id]
            if (asset)
                total += this.prices[asset.symbol] * (asset.balance||0)
        })
        // console.log( 'recalculating balance...', totalAssets, total )
        return total
    }),

    // UI
    menuOpen: false,
    currencyMenuOpen: false,
    view: {},
    notifications: {},
    popups: {
        closeSession: {
            open: false
        }
    }
}



// restoring price from localStorage
const assetsArray = Object.keys(Assets)
assetsArray.forEach(symbol => {
    if (localStorage.getItem(symbol) !== null)
        initialState.prices[symbol] = Number(localStorage.getItem(symbol))
})


// restoring assets from localStorage
try {
    let assets = localStorage.getItem('assets')
    assets = JSON.parse(assets)
    if (assets && typeof assets == 'object') {
        initialState.assets = assets
        for (let asset_id in assets)
            assets[asset_id] = generateDefaultAsset(assets[asset_id])
    }
} catch (e) {
    console.error('restoring assets from localStorage', e );
}




// registering
const state = register(initialState)




// totalAssets autoupdate
const updateTotalAssets = m => (state.totalAssets = getTotalAssets(state.assets))
updateTotalAssets()
const observer = createObserver(updateTotalAssets)
observer.observe(state, 'assets')
observer.observe(state.assets)




// implementing location router (special object)
create(window.location.href, state)




export default state