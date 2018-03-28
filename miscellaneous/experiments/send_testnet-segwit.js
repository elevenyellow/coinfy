// ------ script -------
const request = require('request')
const Bitcoin = require('bitcoinjs-lib')

const network = Bitcoin.networks.testnet
const fee = 100000
const alice = 'cQA29xw1do9iux5ZHRbRNVP81EPExK3N2Z6sgMKZsqd7NbH3uTec' // 2N9Cki8ABz6oXuoF24rd5eAFPwwVpEWYctt
const bob = 'cRhAysbHYkydyzyA2fo9TDELwFiDmRjA1eXv7itSHiQPvUG3iBQi' // 2NDcpwiwbrXxy3JEow32TfixJEuWFLvDzLw
const connor = '93KjsqW9w3efffxS4jb9AefrRoXwFx62UZumWwnkgX6mLYMPZgx' // mwANXKvZEnDyRRY4dWwuvCkrhMCfcxruQg
const keys = {
    [getSegwitAddressFromPrivateKey(alice)]: alice,
    [getSegwitAddressFromPrivateKey(bob)]: bob,
    [getAddressFromPrivateKey(connor)]: connor
}
const addrs = Object.keys(keys)

request(
    `https://test-insight.bitpay.com/api/addrs/${addrs.join()}/utxo`,
    (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const txs = JSON.parse(body)
            const balance = txs.map(tx => tx.satoshis).reduce((a, c) => a + c)

            const balance_available = balance - fee
            const amount = Math.round(balance_available / addrs.length)
            console.log('balance', fromSatoshis(balance))
            console.log('fee', fromSatoshis(fee))
            console.log('balance_available', fromSatoshis(balance_available))
            console.log('amount', fromSatoshis(amount))

            // Adding inputs
            const txb = new Bitcoin.TransactionBuilder(network)
            txs.forEach(tx => txb.addInput(tx.txid, tx.vout))

            // Adding outputs
            addrs.forEach(addr => txb.addOutput(addr, amount))

            // Signing txs
            txb.inputs.forEach((input, index) => {
                // Signing
                const tx = txs[index]
                const addr = tx.address
                const ecpair = Bitcoin.ECPair.fromWIF(keys[addr], network)
                const redeem_script = getRedeemScript(ecpair)
                isSegwitAddress(addr)
                    ? txb.sign(index, ecpair, redeem_script, null, tx.satoshis)
                    : txb.sign(index, ecpair)
            })

            const transaction = txb.build()
            console.log(`
                    GO TO ANY OF THIS ADDRESS AND PUSH YOUR TRANSACTION:
                    https://testnet-bitcore1.trezor.io/tx/send`)
            console.log('==============')
            console.log(transaction.toHex())
            console.log('==============')
        }
    }
)

// https://testnet.coinfaucet.eu/en/
// http://tpfaucet.appspot.com/
// https://testnet.manu.backend.hamburg/faucet
// https://bitcoinfees.21.co/api/v1/fees/recommended
// https://insight.bitpay.com/api/utils/estimatefee

function fromSatoshis(n) {
    return n / 100000000
}

function getAddressFromPrivateKey(private_key) {
    const wallet = Bitcoin.ECPair.fromWIF(private_key, network)
    return wallet.getAddress().toString()
}

function getSegwitAddressFromPrivateKey(private_key) {
    const wallet = Bitcoin.ECPair.fromWIF(private_key, network)
    // wallet.compressed = false
    const ecpair = new Bitcoin.ECPair(wallet.d)
    return getSegwitAddressFromECPair(ecpair)
}
function getSegwitAddressFromECPair(ecpair) {
    const redeemScript = getRedeemScript(ecpair)
    const redeemScriptHash = Bitcoin.crypto.hash160(redeemScript)
    const scriptPubKey = Bitcoin.script.scriptHash.output.encode(
        redeemScriptHash
    )
    return Bitcoin.address.fromOutputScript(scriptPubKey, network)
}
function getRedeemScript(ecpair) {
    const pubKey = ecpair.getPublicKeyBuffer()
    const pubKeyHash = Bitcoin.crypto.hash160(pubKey)
    return Bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash)
}

function isSegwitAddress(address) {
    const { version } = Bitcoin.address.fromBase58Check(address)
    return (
        version === Bitcoin.networks.bitcoin.scriptHash ||
        version === Bitcoin.networks.testnet.scriptHash
    )
}
