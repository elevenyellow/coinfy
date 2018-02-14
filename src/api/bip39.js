import bip39 from 'bip39crypto'
import Bitcoin from 'bitcoinjs-lib'
import crypto from 'crypto'

export function getBip32RootKey({
    seed,
    passphase = '',
    network = Bitcoin.networks.bitcoin
}) {
    const seed_raw = bip39.mnemonicToSeed(seed, passphase)
    return Bitcoin.HDNode.fromSeedHex(seed_raw, network)
}

export function getRandomMnemonic(words_number = 12) {
    const randomBytes = crypto.randomBytes(words_number === 12 ? 16 : 32)
    return bip39.entropyToMnemonic(randomBytes.toString('hex'))
}

export function validateSeed(seed) {
    return bip39.validateMnemonic(seed)
}
