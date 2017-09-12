
// https://github.com/bitpay/insight-api

export function getBalance(address) {
    fetch(`https://insight.bitpay.com/api/addr/${address}/balance`)
    .then(response => response.text())
    .then(text => {
        console.log( text );
    })
}


export function fetchTxData(address) {
    fetch(`https://insight.bitpay.com/api/addrs/${address}/txs?noScriptSig=1&noAsm=1&noSpent=0`)
    .then(response => response.json())
    .then(json => {
        console.log( json );
    })
}

// window.getBalance = getBalance