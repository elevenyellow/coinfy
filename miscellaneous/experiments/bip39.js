var bip39 = require('bip39') // npm i -S bip39
var crypto = require('crypto')
var bitcoin = require('bitcoinjs-lib') // npm i -S bitcoinjs-lib

var  randomBytes = crypto.randomBytes(16) // 128 bits is enough
// var mnemonic = bip39.entropyToMnemonic(randomBytes.toString('hex')) 
var mnemonic = 'report useless hybrid carry fragile acid never between accuse sunset transfer slow skill autumn lyrics'
var seed = bip39.mnemonicToSeed(mnemonic) // you'll use this in #3 below



var bitcoinNetwork = bitcoin.networks.bitcoin
var hdMaster = bitcoin.HDNode.fromSeedBuffer(seed, bitcoinNetwork) // seed from above
var key1 = hdMaster.derivePath("m/44'/0'/0'/0/0")
var key2 = hdMaster.derivePath("m/44'/0'/0'/0/1")

console.log(key1.keyPair.toWIF())
console.log(key2.keyPair.toWIF())