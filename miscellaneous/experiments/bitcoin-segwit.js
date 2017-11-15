var bitcoin = require('bitcoinjs-lib')
let bigi = require('bigi')
let crypto = require( 'crypto')


function generatePrivateKey(){
    const wallet = bitcoin.ECPair.makeRandom()
    return wallet.toWIF()
}

function getAddressFromPrivateKey(private_key) {
    const wallet = bitcoin.ECPair.fromWIF(private_key)
    // wallet.compressed = false
    const nkeyp = new bitcoin.ECPair(wallet.d);
    const pubKey = nkeyp.getPublicKeyBuffer();
    const pubKeyHash = bitcoin.crypto.hash160(pubKey);
    const redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash);
    const redeemScriptHash = bitcoin.crypto.hash160(redeemScript);
    const scriptPubKey = bitcoin.script.scriptHash.output.encode(redeemScriptHash);
    return bitcoin.address.fromOutputScript(scriptPubKey, bitcoin.networks.bitcoin);
}

console.log(
    getAddressFromPrivateKey("KzW5W7kriXPoaExfPxN4igxu9PVZQb1zGfSJeveP8G8ChRHgMzdp")
)