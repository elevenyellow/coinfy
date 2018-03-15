const request = require('request')
const fetch = require('node-fetch')

fetch('https://api.coinmarketcap.com/v1/ticker/?limit=1')
    .then(res => res.json())
    .then(coins => {
        coins.forEach(coin => {
            const symbol = coin.symbol
            console.log(coin.symbol)
            fetchAny(urls.map(url => url(symbol)))
                .then(response => response.text())
                .then(svg => {
                    console.log(svg)
                })
                .catch(e => {
                    console.log(e)
                })
        })
    })

const urls = [
    symbol =>
        `https://cryptocoincharts.info/img/coins/${symbol.toLowerCase()}.svg`,
    symbol =>
        `https://cgi.cryptoreport.com/images/coins/${symbol.toLowerCase()}.svg`,
    symbol =>
        `https://cgi.cryptoreport.com/images/coins/${symbol.toLowerCase()}.png`
]

function fetchAny(urls) {
    let response, reject
    let index = 0
    const fetchLoop = url => {
        // request(url, (e, response, body) => {
        //     console.log(response.statusCode)
        //     if (!e) resolve([(e, response, body)])
        //     else if (e && index < urls.length - 1) fetchLoop(urls[++index])
        //     else reject('notfound')
        // })
        fetch(url)
            .then(r => {
                if (r.status === 200) return response(r)
                else if (index < urls.length - 1) fetchLoop(urls[++index])
                else reject(e)
            })
            .catch(e => {
                if (index < urls.length - 1) fetchLoop(urls[++index])
                else reject('Not found')
            })
    }
    fetchLoop(urls[index])
    return new Promise((res, rej) => {
        response = res
        reject = rej
    })
}
