// DON'T USE THIS SCRIPT. IS INCOMPLETE

const PRIVATE_KEY = 'KwEJHfL3RMS8dkF8s3ov1Uzr5iZ9hUDrcYSPLwnhqyE7VALVgRnw'
const ADDRESS_BENEFICIARY = '1LyhGemJhQYH4mNpPJHxRCea9tqraHWxBV'
const AMOUNT_TOSEND = 9000


// ------ script -------
const request = require('request')
const bitcoin = require('bitcoinjs-lib')

const key = bitcoin.ECPair.fromWIF(PRIVATE_KEY)
const address = key.getAddress().toString()

// const httpapi = 'https://blockchain.info/multiaddr?active='
const httpapi = 'https://blockchain.info/rawaddr/'

request(httpapi+address, (error, response, body)=> {
    if (!error && response.statusCode === 200) {
        const data = JSON.parse(body)
        const lastTransaction = data.txs[0]
        const lastHashTransaction = lastTransaction.hash
        const index = getIndexFromTransaction(lastTransaction.out, address)
        // console.log( lastHashTransaction, index );

        // Creating transaction
        const tx = new bitcoin.TransactionBuilder()
        tx.addInput(lastHashTransaction, index)
        tx.addOutput(ADDRESS_BENEFICIARY, AMOUNT_TOSEND);
        tx.sign(0, key)
        const transaction = tx.build()
        console.log(`
GO TO ANY OF THIS ADDRESS AND PUSH YOUR TRANSACTION:
https://blockr.io/tx/push
https://blockchain.info/pushtx
https://insight.bitpay.com/tx/send
https://live.blockcypher.com/btc/decodetx/`)
        console.log('==============')
        console.log(transaction.toHex()) 
        console.log('==============')

    } 
    else
        console.log("Got an error: ", error, ", status code: ", response.statusCode)
})


function getIndexFromTransaction(list, address) {
    for (let index=0; index<list.length; index++)
        if (list[index].addr === address)
            return index
}