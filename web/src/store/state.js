import { register, createObserver } from 'dop'
import { create } from '/doprouter/core'
import { cryptos } from '/const/cryptos'
import { USD } from '/const/currencies'
import { getTotalWallets } from '/store/getters'

// initial state
const initialState = {
    // Data
    prices: {},
    currency: localStorage.getItem('currency') || USD.symbol,
    walletsExported: localStorage.getItem('walletsExported') !== 'false',
    wallets: {},

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

// creating subinstance of cryptos availables
const cryptosArray = Object.keys(cryptos)
cryptosArray.forEach(symbol => {
    initialState.prices[symbol] = {}
    // initialState.wallets[symbol] = {}
})
    

// restoring wallets
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
cryptosArray.forEach(crypto => {
    if (state.wallets[crypto])
        observer.observe(state.wallets[crypto])
})

// implementing location router (special object)
create(window.location.href, state)

export default state;













