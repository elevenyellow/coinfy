// https://iancoleman.io/bip39/
// https://github.com/ethereum/EIPs/issues/84
// https://github.com/trapp/ethereum-bip44
// m/44'/60'/0'/0/x: BIP44, MetaMask, Jaxx, MyEtherWallet (default), TREZOR App, Exodus
// m/44'/60'/x'/0/0: BIP44, KeepKey, MetaMask (custom)
// m/44'/60'/0'/x: Electrum, MyEtherWallet (ledger), Ledger Chrome App, imToken
// m/44'/coin_type'/account'/0: Coinomi

var bip39 = require('bip39') // npm i -S bip39
var crypto = require('crypto')
var bitcoin = require('bitcoinjs-lib') // npm i -S bitcoinjs-lib
var ethereum = require('ethereumjs-util')

var network = bitcoin.networks.bitcoin

// var randomBytes = crypto.randomBytes(16) // 128 bits is enough
// var words = bip39.entropyToMnemonic(randomBytes.toString('hex'))
var words =
    'cycle ladder vault piano steel put copy cancel purse scare before wood'
var seed = bip39.mnemonicToSeed(words, '')

var bip32RootKey = bitcoin.HDNode.fromSeedHex(seed, network)
// var bip32RootKey = bitcoin.HDNode.fromSeedBuffer(seed, network)
// var bip32RootKey = bitcoin.HDNode.fromBase58(rootKeyBase58, network)

var keyBTC = bip32RootKey.derivePath("m/44'/0'/0'/0/0")
var keyETH = bip32RootKey.derivePath("m/44'/60'/0'/0/0")

// .toWIF()
console.log('seed:', seed.toString('hex'))
console.log('bip32RootKey:', bip32RootKey.toBase58())
console.log(keyBTC.keyPair.getAddress())
console.log(
    '0x' +
        ethereum.privateToAddress(keyETH.keyPair.d.toBuffer()).toString('hex')
)
