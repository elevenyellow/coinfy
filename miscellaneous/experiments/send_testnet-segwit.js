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
const fee = 10000
const addrs = {
    [aliceaddr]: alice,
    [bobaddr]: bob
}

// request(
//     `https://test-insight.bitpay.com/api/addr/${aliceaddr}`,
//     (error, response, body) => {
//         if (!error && response.statusCode === 200) {
//             const data = JSON.parse(body)
//             const balance =
//                 data.unconfirmedBalanceSat < 0
//                     ? data.balanceSat + data.unconfirmedBalanceSat
//                     : data.balanceSat

request(
    `https://test-insight.bitpay.com/api/addrs/${Object.keys(
        addrs
    ).join()}/utxo`,
    (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const txs = JSON.parse(body)
            const balance = txs.map(tx => tx.satoshis).reduce((a, c) => a + c)

            const balance_available = balance - fee
            const amount = balance_available / 2
            const amount_back = balance_available / 2
            console.log('balance', fromSatoshis(balance))
            console.log('fee', fromSatoshis(fee))
            console.log('balance_available', fromSatoshis(balance_available))
            console.log('amount', fromSatoshis(amount))
            console.log('amount_back', fromSatoshis(amount_back))

            // Adding inputs
            const txb = new Bitcoin.TransactionBuilder(network)
            txs.forEach(tx => txb.addInput(tx.txid, tx.vout))

            // Adding outputs
            txb.addOutput(bobaddr, amount)
            txb.addOutput(aliceaddr, amount_back)

            // Signing txs
            txb.inputs.forEach((input, index) => {
                // Signing
                const tx = txs[index]
                const private_key_ecpair = Bitcoin.ECPair.fromWIF(
                    addrs[tx.address],
                    network
                )
                const redeem_script = getRedeemScript(private_key_ecpair)
                txb.sign(
                    index,
                    private_key_ecpair,
                    redeem_script,
                    null,
                    tx.satoshis
                )
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

// https://bitcoinfees.21.co/api/v1/fees/recommended
// https://insight.bitpay.com/api/utils/estimatefee

function fromSatoshis(n) {
    return n / 100000000
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
