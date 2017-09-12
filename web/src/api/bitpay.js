
// https://github.com/bitpay/insight-api

const api_url = 'https://insight.bitpay.com/api'

export function getBalance(address) {
    fetch(`${api_url}/api/addr/${address}/balance`)
    .then(response => response.text())
    .then(text => {
        console.log( text );
    })
}


export function fetchTxData(address) {
    fetch(`${api_url}/api/addrs/${address}/txs?noScriptSig=1&noAsm=1&noSpent=0`)
    .then(response => response.json())
    .then(json => {
        console.log( json );
    })
}

// window.getBalance = getBalance