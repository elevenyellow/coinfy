import bip39 from 'bip39'
import Bitcoin from 'bitcoinjs-lib'

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
