import { resolveAll, fetchTimeout } from '/api/promises'

// await getAllPrices(["BTC","ETH"], "USD") = {BTC:[2541,2500], ETH:[323,320]}
export function getAllPrices(cryptos, fiat, timeout) {
    return resolveAll([
        getPriceFromCryptocompare(cryptos, fiat, timeout),
        getPriceFromCoinmarketcap(cryptos, fiat, timeout)
    ]).then(items => {
        const prices = {}
        cryptos.forEach(symbol => {
            if (!prices[symbol]) prices[symbol] = []
            items.forEach(item => {
                const n = item[symbol]
                if (n && typeof n == 'number' && !isNaN(n))
                    prices[symbol].push(n)
            })
        })
        return prices
    })
}

// await getPriceFromCryptocompare(["BTC","ETH"], "USD") = {BTC:2541.3, ETH:323.3}
export function getPriceFromCryptocompare(assets, currency, timeout) {
    const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${assets.join(
        ','
    )}&tsyms=${currency}`
    return fetchTimeout(url, { timeout: timeout })
        .then(response => response.json())
        .then(json => {
            const prices = {}
            assets.forEach(crypto => {
                if (json[crypto] && json[crypto][currency])
                    prices[crypto] = json[crypto][currency]
            })
            return prices
        })
}

// await getPriceFromCoinmarketcap(["BTC","ETH"], "USD") = {BTC:2541.3, ETH:323.3}
export function getPriceFromCoinmarketcap(assets, currency, timeout) {
    const url = `https://api.coinmarketcap.com/v1/ticker/?convert=${currency}&limit=1000`
    return fetchTimeout(url, { timeout: timeout })
        .then(response => response.json())
        .then(json => {
            const prices = {}
            let count = 0
            let price
            let index = 0
            let total = json.length
            for (; index < total; ++index) {
                price = json[index]
                if (assets.indexOf(price.symbol) > -1) {
                    prices[price.symbol] = Number(
                        price[`price_${currency.toLowerCase()}`]
                    )
                    if (++count >= assets.length) break
                }
            }
            return prices
        })
}

// export function CryptoPriceManager() {
//     this.timeoutMiliseconds = 5000
//     this.prices = {}
// }

// CryptoPriceManager.prototype.fetch = function(arrayassets, currency) {
//     if (this.cancel) this.cancel()

//     let assetsFinished = 0
//     let finished = false
//     arrayassets.forEach(crypto => {
//         this.prices[crypto] = []
//     })

//     const update = (crypto, value, source) => {
//         const pricesArray = this.prices[crypto]
//         pricesArray.push(value)
//         if (this.onUpdate) this.onUpdate(crypto, value, source)
//         if (pricesArray.length === this.totalServicesUsing) {
//             assetsFinished += 1
//             if (this.onFinish) this.onFinish(crypto, pricesArray)
//         }
//     }

//     this.totalServicesUsing = 2
//     getPriceFromCryptocompare(
//         arrayassets,
//         currency,
//         (crypto, value) => update(crypto, value, 'cryptocompare'),
//         this.onError
//     )
//     getPriceFromCoinmarketcap(
//         arrayassets,
//         currency,
//         (crypto, value) => update(crypto, value, 'coinmarketcap'),
//         this.onError
//     )

//     setTimeout(() => {
//         if (!finished) {
//             finished = true
//             arrayassets.forEach(crypto => {
//                 const pricesArray = this.prices[crypto]
//                 if (
//                     this.prices[crypto].length < this.totalServicesUsing &&
//                     this.onFinish
//                 )
//                     this.onFinish(crypto, pricesArray)
//             })
//         }
//     }, this.timeoutMiliseconds)

//     this.cancel = function cancel() {
//         finished = true
//     }
// }
// CryptoPriceManager.prototype.onUpdate = function(currency, value, source) {}
// CryptoPriceManager.prototype.onFinish = function(currency, values) {}
// CryptoPriceManager.prototype.onFinishAll = function() {}

// window.getCurrencyPrice = function() {
//     let eurrate
//     const url =
//         'https://query.yahooapis.com/v1/public/yql?format=json&q=select * from yahoo.finance.xchange where pair in ("USDGBP","USDPHP")&env=store://datatables.org/alltableswithkeys'
//     fetch(url)
//         .then(function(response) {
//             return response.json()
//         })
//         .then(function(json) {
//             /* process your JSON further */
//             eurrate = json.query.results.rate[0].Rate
//             return fetch('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,GBP')
//         })
//         .then(function(response) {
//             return response.json()
//         })
//         .then(function(json) {
//             console.log( json.USD*Number(eurrate), json.GBP );
//         })
//         .catch(function(error) {
//             console.log(error)
//         })
// }

// https://query.yahooapis.com/v1/public/yql?format=json&q=select * from yahoo.finance.xchange where pair in ("USDGBP","USDPHP")&env=store://datatables.org/alltableswithkeys
// "USDAED","USDAFN","USDALL","USDAMD","USDANG","USDAOA","USDARS","USDAUD","USDAWG","USDAZN","USDBAM","USDBBD","USDBDT","USDBGN","USDBHD","USDBIF","USDBND","USDBOB","USDBRL","USDBSD","USDBTN","USDBWP","USDBYR","USDBZD","USDCAD","USDCDF","USDCHF","USDCLP","USDCNY","USDCOP","USDCRC","USDCUC","USDCVE","USDCZK","USDDJF","USDDKK","USDDOP","USDDZD","USDEEK","USDEGP","USDERN","USDETB","USDEUR","USDFJD","USDFKP","USDGBP","USDGEL","USDGHS","USDGIP","USDGMD","USDGNF","USDGQE","USDGTQ","USDGYD","USDHKD","USDHNL","USDHRK","USDHTG","USDHUF","USDIDR","USDILS","USDINR","USDIQD","USDIRR","USDISK","USDJMD","USDJOD","USDJPY","USDKES","USDKGS","USDKHR","USDKMF","USDKPW","USDKRW","USDKWD","USDKYD","USDKZT","USDLAK","USDLBP","USDLKR","USDLRD","USDLSL","USDLTL","USDLVL","USDLYD","USDMAD","USDMDL","USDMGA","USDMKD","USDMMK","USDMNT","USDMOP","USDMRO","USDMUR","USDMVR","USDMWK","USDMXN","USDMYR","USDMZM","USDNAD","USDNGN","USDNIO","USDNOK","USDNPR","USDNZD","USDOMR","USDPAB","USDPEN","USDPGK","USDPHP","USDPKR","USDPLN","USDPYG","USDQAR","USDRON","USDRSD","USDRUB","USDRWF","USDSAR","USDSBD","USDSCR","USDSDG","USDSEK","USDSGD","USDSHP","USDSKK","USDSLL","USDSOS","USDSRD","USDSTD","USDSYP","USDSZL","USDTHB","USDTJS","USDTMM","USDTND","USDTOP","USDTRY","USDTTD","USDTWD","USDTZS","USDUAH","USDUGX","USDUSD","USDUYU","USDUZS","USDVEB","USDVND","USDVUV","USDWST","USDXAF","USDXCD","USDXDR","USDXOF","USDXPF","USDYER","USDZAR","USDZMK"
