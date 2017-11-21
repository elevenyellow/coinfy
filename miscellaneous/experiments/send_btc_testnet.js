// ------ script -------
const request = require('request')
const Bitcoin = require('bitcoinjs-lib')
// https://testnet.coinfaucet.eu/en/
// http://tpfaucet.appspot.com/
// https://testnet.manu.backend.hamburg/faucet

const testnet = Bitcoin.networks.testnet


function getAddressFromPrivateKey(private_key) {
    const wallet = Bitcoin.ECPair.fromWIF(private_key, testnet)
    return wallet.getAddress().toString()
}


const alice = 'cTkq25b18kC2WLMkx7pYMFfT6A8yXEMSxt3GShqTCq8Twx1FCpS5'
const bob = 'cRkNqWAK64qSooKnadaFLa9uhSK1QtgkD5ezJQcsn1Fz5LQSnHT5'
const aliceaddr = getAddressFromPrivateKey(alice)
const bobaddr = getAddressFromPrivateKey(bob)
const balance = 371554135
const fee = 12189

const httpApi = (addr, path='') => `https://test-insight.bitpay.com/api/addr/${addr}${path}`

request(httpApi(aliceaddr,'/utxo'), (error, response, body)=> {
    if (!error && response.statusCode === 200) {
        const txs = JSON.parse(body)
        const lastTx = txs[0]
        const txid = lastTx.txid
        const vout = lastTx.vout

        const balanceToSend = (balance-fee)/2
        const tx = new Bitcoin.TransactionBuilder(testnet)
        tx.addInput(txid, vout)
        tx.addOutput(bobaddr, balanceToSend);
        tx.addOutput(aliceaddr, balanceToSend);
        tx.sign(0, Bitcoin.ECPair.fromWIF(alice, testnet))

        const transaction = tx.build()
        console.log(`
        GO TO ANY OF THIS ADDRESS AND PUSH YOUR TRANSACTION:
        https://test-insight.bitpay.com/tx/send`)
        console.log('==============')
        console.log(transaction.toHex()) 
        console.log('==============')
    }        
})

// https://bitcoinfees.21.co/api/v1/fees/recommended
// https://insight.bitpay.com/api/utils/estimatefee
