export function CryptoPriceManager(arrayCryptos, currency) {

    const object = {}

    object.finished = true
    object.timeoutMiliseconds = 5000
    object.currency = currency
    object.arrayCryptos = arrayCryptos
    object.prices = {}


    object.cryptosFinished = 0
    object.finished = false
    object.arrayCryptos.forEach(crypto => {
        object.prices[crypto] = []
    })

    const update = (crypto, value, source) => {
        const pricesArray = object.prices[crypto]
        pricesArray.push(value)
        if (!object.finished && object.onUpdate) 
            object.onUpdate(crypto, value, source)
        if (!object.finished && pricesArray.length === object.totalServicesUsing) {
            object.cryptosFinished += 1
            if (object.onFinish) object.onFinish(crypto, pricesArray)
            if (object.cryptosFinished === object.totalServicesUsing) {
                object.finished = true
                if (object.onFinishAll) object.onFinishAll()
            }
        }
    }


    object.totalServicesUsing = 2
    getPriceFromCryptocompare(object.arrayCryptos, object.currency, update)
    getPriceFromCoinmarketcap(object.arrayCryptos, object.currency, update)


    setTimeout(() => {
        if (!object.finished) {
            object.finished = true
            object.arrayCryptos.forEach(crypto => {
                const pricesArray = object.prices[crypto]
                if (
                    object.prices[crypto].length < object.totalServicesUsing &&
                    object.onFinish
                )
                    object.onFinish(crypto, pricesArray)
            })
            if (object.onFinishAll) object.onFinishAll()
        }
    }, object.timeoutMiliseconds)

    return object
}
// CryptoPriceManager.prototype.onUpdate = function(currency, value, source) {}
// CryptoPriceManager.prototype.onFinish = function(currency, values) {}
// CryptoPriceManager.prototype.onFinishAll = function() {}




// getPriceFromCryptocompare(["BTC","ETH"], "USD") = {BTC:2541.3, ETH:323.3}
function getPriceFromCryptocompare(cryptos, currency, update) {
    const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${cryptos.join(
        ','
    )}&tsyms=${currency}`
    fetch(url).then(response => response.json()).then(json => {
        const prices = {}
        cryptos.forEach(crypto => {
            update(crypto, json[crypto][currency], 'getPriceFromCryptocompare')
        })
    })
}

// getPriceFromCoinmarketcap(["BTC","ETH"], "USD") = {BTC:2541.3, ETH:323.3}
function getPriceFromCoinmarketcap(cryptos, currency, update) {
    const url = `https://api.coinmarketcap.com/v1/ticker/?convert=${currency}&limit=50`
    fetch(url).then(response => response.json()).then(json => {
        const prices = {}
        let count = 0
        let price
        for (let index = 0, total = json.length; index < total; ++index) {
            price = json[index]
            if (cryptos.indexOf(price.symbol) > -1)
                update(
                    price.symbol,
                    Number(price[`price_${currency.toLowerCase()}`]),
                    'getPriceFromCoinmarketcap'
                )
            if (++count > cryptos.length) break
        }
    })
}

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
