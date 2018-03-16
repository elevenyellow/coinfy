const request = require('request')
const fs = require('fs')

request(
    'https://api.coinmarketcap.com/v1/ticker/?limit=0',
    { encoding: null },
    (e, response, body) => {
        const coins = JSON.parse(body)
        coins.forEach((coin, index) => {
            const symbol = coin.symbol
            setTimeout(() => {
                console.log(`${symbol}:`)
                fetchAny(
                    urls.map(url => url(symbol)),
                    (url, response, body) => {
                        console.log(url)
                        const buffer = Buffer.from(body, 'utf8')
                        fs.writeFileSync(
                            `./public/static/image/coinslogos/${symbol}.svg`,
                            buffer
                        )
                    }
                )
            }, index * 5000)
        })
    }
)

const urls = [
    symbol =>
        `https://cryptocoincharts.info/img/coins/${symbol.toLowerCase()}.svg`,
    symbol =>
        `https://cgi.cryptoreport.com/images/coins/${symbol.toLowerCase()}.svg`
    // symbol =>
    // `https://cgi.cryptoreport.com/images/coins/${symbol.toLowerCase()}.png`
    // symbol =>
    // `https://cryptocoincharts.info/img/coins/${symbol.toLowerCase()}.png`
]

function fetchAny(urls, callback) {
    let index = 0
    const fetchLoop = url => {
        request(url, (e, response, body) => {
            if (!e && response.statusCode === 200) callback(url, response, body)
            else if (index < urls.length - 1) fetchLoop(urls[++index])
        })
    }
    fetchLoop(urls[index])
}

//     .then(res => res.json())
//     .then(coins => {
//         coins.forEach(coin => {
//             const symbol = coin.symbol
//             console.log(coin.symbol)
//             fetchAny(urls.map(url => url(symbol)))
//                 .then(response => response.text())
//                 .then(response => {
//                     response.text()
//                     console.log(svg)
//                 })
//                 .catch(e => {
//                     console.log(e)
//                 })
//         })
//     })
