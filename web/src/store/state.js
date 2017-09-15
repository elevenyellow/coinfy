import { computed, register, createObserver } from 'dop'
import { create } from '/doprouter/core'
import { Assets } from '/api/Assets'
import { currencies, USD } from '/const/currencies'
import { getTotalWallets } from '/store/getters'


// initial state
const initialState = {
    // Data
    prices: {},
    currency: localStorage.getItem('currency') || USD.symbol,
    assetsExported: localStorage.getItem('assetsExported') !== 'false',
    assets: {},
    balance: computed(function() {
        let total = 0
        Object.keys(this.assets).forEach(symbol => {
            Object.keys(this.assets[symbol]).forEach(address => {
                if (this.assets[symbol][address])
                    total += this.prices[symbol] * (this.assets[symbol][address].balance||0)
            })
        })
        // console.log( 'recalculating balance...', total )
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
    initialState.assets[symbol] = {}
    if (localStorage.getItem(symbol) !== null)
        initialState.prices[symbol] = Number(localStorage.getItem(symbol))
})
    


// restoring assets from localStorage
try {
    let assets = window.localStorage.getItem('assets')
    assets = JSON.parse(assets)
    if (assets && typeof assets == 'object') initialState.assets = assets
} catch (e) {}




// registering
const state = register(initialState)





// totalWallets autoupdate
const updateTotalWallets = () =>
    (state.totalWallets = getTotalWallets(state.assets))
updateTotalWallets()
const observer = createObserver(updateTotalWallets)
observer.observe(state, 'assets')
assetsArray.forEach(crypto => {
    if (state.assets[crypto])
        observer.observe(state.assets[crypto])
})




// implementing location router (special object)
create(window.location.href, state)



export default state;













