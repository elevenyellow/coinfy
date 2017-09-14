import { computed, register, createObserver } from 'dop'
import { create } from '/doprouter/core'
import { assets } from '/api/assets'
import { currencies, USD } from '/const/currencies'
import { getTotalWallets } from '/store/getters'


// initial state
const initialState = {
    // Data
    prices: {},
    currency: localStorage.getItem('currency') || USD.symbol,
    walletsExported: localStorage.getItem('walletsExported') !== 'false',
    wallets: {},
    balance: computed(function() {
        let total = 0
        Object.keys(this.wallets).forEach(symbol => {
            Object.keys(this.wallets[symbol]).forEach(address => {
                total += this.prices[symbol] * (this.wallets[symbol][address].balance||0)
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
const assetsArray = Object.keys(assets)
assetsArray.forEach(symbol => {
    initialState.wallets[symbol] = {}
    if (localStorage.getItem(symbol) !== null)
        initialState.prices[symbol] = Number(localStorage.getItem(symbol))
})
    


// restoring wallets from localStorage
try {
    let wallets = window.localStorage.getItem('wallets')
    wallets = JSON.parse(wallets)
    if (wallets && typeof wallets == 'object') initialState.wallets = wallets
} catch (e) {}




// registering
const state = register(initialState)



// totalWallets autoupdate
const updateTotalWallets = () =>
    (state.totalWallets = getTotalWallets(state.wallets))
updateTotalWallets()
const observer = createObserver(updateTotalWallets)
observer.observe(state, 'wallets')
assetsArray.forEach(crypto => {
    if (state.wallets[crypto])
        observer.observe(state.wallets[crypto])
})




// implementing location router (special object)
create(window.location.href, state)



export default state;













