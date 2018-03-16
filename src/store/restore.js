import { Coins } from '/api/coins'
import { createERC20 } from '/api/coins/ERC20'
import { generateDefaultAsset, getSymbolsFromAssets } from '/store/getters'
import { jsonParse } from '/api/objects'
import { localStorageGet } from '/api/browser'
import {
    LOCALSTORAGE_ASSETS,
    LOCALSTORAGE_ASSETSEXPORTED,
    LOCALSTORAGE_CUSTOMS
} from '/const/'

export default function(initialState) {
    // restoring custom coins/tokens created by the user
    const cryptos = jsonParse(
        localStorageGet(LOCALSTORAGE_CUSTOMS, initialState.network)
    )
    for (let symbol in cryptos) Coins[symbol] = createERC20(cryptos[symbol])

    // restoring assets
    const assets = jsonParse(
        localStorageGet(LOCALSTORAGE_ASSETS, initialState.network)
    )
    const assets_state = initialState.assets
    for (let asset_id in assets)
        if (Coins[assets[asset_id].symbol])
            assets_state[asset_id] = generateDefaultAsset(assets[asset_id])

    // restoring prices
    const assetsArray = getSymbolsFromAssets(initialState.assets)
    assetsArray.forEach(symbol => {
        if (localStorageGet(symbol) !== null)
            initialState.prices[symbol] = Number(localStorageGet(symbol))
    })
}
