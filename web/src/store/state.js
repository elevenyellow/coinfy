import { register, createObserver } from 'dop'
import { create } from '/doprouter/core'
import { cryptos, BTC } from '/const/cryptos'
import { decryptAES128CTR } from '/api/security'
import { updatePrices } from '/api/prices'
import { isPrivateKey, getAddressFromPrivateKey } from '/api/btc'
import { getTotalWallets } from '/store/getters'


// initial state
const initialState = {
    menuOpen: false,
    notifications: {},
    view: {},
    walletsExported: localStorage.getItem('walletsExported')!=="false",
    wallets: {
        [BTC.symbol]: {}
    },
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
    if (wallets && typeof wallets == 'object')
        initialState.wallets = wallets
} catch(e) {}


// registering
const state = register(initialState)


// totalWallets
const updateTotalWallets = () => state.totalWallets = getTotalWallets(state.wallets)
updateTotalWallets()
const observer = createObserver(updateTotalWallets)
observer.observe(state, 'wallets')
Object.keys(cryptos).forEach(crypto=>{
    observer.observe(state.wallets[crypto])
})


// implementing location router (special object)
create(window.location.href, state)




export default state





setInterval(function(){
    updatePrices(["BTC","BCH"], "USD", function(prices){
        console.log( prices );
    })
}, 60000)