// ------ script -------
const request = require('request')
const Bitcoin = require('bitcoinjs-lib')
// https://testnet.coinfaucet.eu/en/
// http://tpfaucet.appspot.com/
// https://testnet.manu.backend.hamburg/faucet

const network = Bitcoin.networks.testnet

const alice = 'cQA29xw1do9iux5ZHRbRNVP81EPExK3N2Z6sgMKZsqd7NbH3uTec'
const bob = 'cRhAysbHYkydyzyA2fo9TDELwFiDmRjA1eXv7itSHiQPvUG3iBQi'
const aliceaddr = getSegwitAddressFromPrivateKey(alice) // 2N9Cki8ABz6oXuoF24rd5eAFPwwVpEWYctt
const bobaddr = getSegwitAddressFromPrivateKey(bob) // 2NDcpwiwbrXxy3JEow32TfixJEuWFLvDzLw
const fee = 1000
const origin = bob

const httpApi = (addr, path = '') =>
    `https://test-insight.bitpay.com/api/addr/${addr}${path}`

request(
    httpApi(getSegwitAddressFromPrivateKey(origin), ''),
    (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body)
            const balance =
                data.unconfirmedBalanceSat < 0
                    ? data.balanceSat + data.unconfirmedBalanceSat
                    : data.balanceSat

            request(
                httpApi(getSegwitAddressFromPrivateKey(origin), '/utxo'),
                (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        const txs = JSON.parse(body)
                        const lastTx = txs[0]
                        const txid = lastTx.txid
                        const vout = lastTx.vout

                        const balanceToSend = (balance - fee) / 2
                        const tx = new Bitcoin.TransactionBuilder(network)
                        const private_key_ecpair = Bitcoin.ECPair.fromWIF(
                            origin,
                            network
                        )
                        tx.addInput(txid, vout)
                        tx.addOutput(bobaddr, balanceToSend)
                        tx.addOutput(aliceaddr, balanceToSend)
                        tx.sign(
                            0,
                            private_key_ecpair,
                            getRedeemScript(private_key_ecpair),
                            null,
                            balanceToSend
                        )

                        const transaction = tx.build()
                        console.log(`
                    GO TO ANY OF THIS ADDRESS AND PUSH YOUR TRANSACTION:
                    https://testnet-bitcore1.trezor.io/tx/send`)
                        console.log('==============')
                        console.log(transaction.toHex())
                        console.log('==============')
                    }
                }
            )
        }
    }
)

// https://bitcoinfees.21.co/api/v1/fees/recommended
// https://insight.bitpay.com/api/utils/estimatefee

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
