// https://iancoleman.io/bip39/
// https://github.com/ethereum/EIPs/issues/84
// https://github.com/trapp/ethereum-bip44
// m/44'/60'/0'/0/x: BIP44, MetaMask, Jaxx, MyEtherWallet (default), TREZOR App, Exodus
// m/44'/60'/x'/0/0: BIP44, KeepKey, MetaMask (custom)
// m/44'/60'/0'/x: Electrum, MyEtherWallet (ledger), Ledger Chrome App, imToken
// m/44'/coin_type'/account'/0: Coinomi

var bip39 = require('bip39crypto') // npm i -S bip39
var crypto = require('crypto')
var bitcoin = require('bitcoinjs-lib') // npm i -S bitcoinjs-lib
var ethereum = require('ethereumjs-util')

function getSegwitAddressFromPrivateKey(private_key, network) {
    const wallet = bitcoin.ECPair.fromWIF(private_key, network)
    // wallet.compressed = false
    const nkeyp = new bitcoin.ECPair(wallet.d)
    return getSegwitAddressFromECPair(nkeyp)
}

function getSegwitAddressFromECPair(nkeyp, network) {
    const pubKey = nkeyp.getPublicKeyBuffer()
    const pubKeyHash = bitcoin.crypto.hash160(pubKey)
    const redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(
        pubKeyHash
    )
    const redeemScriptHash = bitcoin.crypto.hash160(redeemScript)
    const scriptPubKey = bitcoin.script.scriptHash.output.encode(
        redeemScriptHash
    )
    return bitcoin.address.fromOutputScript(scriptPubKey, network)
}

const mainnet = bitcoin.networks.mainnet
const testnet = bitcoin.networks.testnet
const litecoin = bitcoin.networks.litecoin

// var randomBytes = crypto.randomBytes(16) // 128 bits is enough
// var words = bip39.entropyToMnemonic(randomBytes.toString('hex'))
var words =
    'cycle ladder vault piano steel put copy cancel purse scare before wood'
var seed = bip39.mnemonicToSeed(words, '')
// console.log('seed:', seed.toString('hex'))

var bip32RootKey = bitcoin.HDNode.fromSeedHex(seed, mainnet)
var bip32RootKeyTestnet = bitcoin.HDNode.fromSeedHex(seed, testnet)
var bip32RootKeyLitecoin = bitcoin.HDNode.fromSeedHex(seed, litecoin)
// // var bip32RootKey = bitcoin.HDNode.fromSeedBuffer(seed, mainnet)
// // var bip32RootKey = bitcoin.HDNode.fromBase58(rootKeyBase58, mainnet)
// console.log('bip32RootKey:', bip32RootKey.toBase58())
// console.log('bip32RootKeyTestnet:', bip32RootKeyTestnet.toBase58())

// BTC
var keyBTC = bip32RootKey.derivePath("m/44'/0'/0'/0/0")
var keyBTCsegwit = bip32RootKey.derivePath("m/49'/0'/0'/0/0")
var keyBTCTestnet = bip32RootKeyTestnet.derivePath("m/44'/1'/0'/0/0")
var keyBTCsegwitTestnet = bip32RootKeyTestnet.derivePath("m/49'/1'/0'/0/0")

// ETH
var keyETH = bip32RootKey.derivePath("m/44'/60'/0'/0/0")

// LTC
var keyLTC = bip32RootKeyLitecoin.derivePath("m/44'/2'/0'/0/0")
var keyLTCsegwit = bip32RootKeyLitecoin.derivePath("m/49'/2'/0'/0/0")

// //
console.log('BTC: ', keyBTC.keyPair.getAddress()) // .toWIF()
console.log(
    'BTCsegwit: ',
    getSegwitAddressFromECPair(keyBTCsegwit.keyPair, mainnet)
) // .toWIF()
console.log('BTCTestnet: ', keyBTCTestnet.keyPair.getAddress()) // .toWIF()
console.log(
    'BTCsegwitTestnet: ',
    getSegwitAddressFromECPair(keyBTCsegwitTestnet.keyPair, testnet)
) // .toWIF()

// ETH
console.log(
    'ETH: ',
    '0x' +
        ethereum.privateToAddress(keyETH.keyPair.d.toBuffer()).toString('hex')
)

// //
console.log('LTC: ', keyLTC.keyPair.getAddress()) // .toWIF()
console.log(
    'LTCsegwit: ',
    getSegwitAddressFromECPair(keyLTCsegwit.keyPair, litecoin)
) // .toWIF()
