import { register, createObserver } from 'dop'
import { create } from '/doprouter/core'
import { cryptos, BTC } from '/const/cryptos'
import { USD } from '/const/currencies'
import { decryptAES128CTR } from '/api/security'
import { getPrices } from '/api/prices'
import { isPrivateKey, getAddressFromPrivateKey } from '/api/btc'
import { getTotalWallets } from '/store/getters'

// initial state
const initialState = {
    // Data
    prices: {},
    currency: localStorage.getItem('currency') || USD.symbol,
    walletsExported: localStorage.getItem('walletsExported') !== 'false',
    wallets: {
        [BTC.symbol]: {}
    },

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
Object.keys(cryptos).forEach(crypto => {
    observer.observe(state.wallets[crypto])
})

// implementing location router (special object)
create(window.location.href, state)

export default state









function updatePriceCryptos() {
    const arrayCryptos = Object.keys(cryptos)
    const totalServices = getPrices(arrayCryptos, state.currency, function(
        crypto,
        prices
    ) {
        console.log(
            crypto,
            prices.reduce((sum, a) => sum + a, 0) / (prices.length || 1)
        )
    })
}

updatePriceCryptos()
