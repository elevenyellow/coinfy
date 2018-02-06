import bip39 from 'bip39'
import Bitcoin from 'bitcoinjs-lib'
import crypto from 'crypto'

export function getBip32RootKey({
    words,
    derived_path,
    passphase = '',
    network = Bitcoin.networks.bitcoin
}) {
    const seed = bip39.mnemonicToSeed(words, passphase)
    const bip32RootKey = Bitcoin.HDNode.fromSeedHex(seed, network)
    return bip32RootKey.derivePath(derived_path)
}

export function gerRandomMnemonic(words_number = 12) {
    const randomBytes = crypto.randomBytes(words_number === 12 ? 16 : 32)
    return bip39.entropyToMnemonic(randomBytes.toString('hex'))
}
