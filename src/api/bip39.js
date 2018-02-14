import bip39 from 'bip39crypto'
import Bitcoin from 'bitcoinjs-lib'
import crypto from 'crypto'
import { recovery_phrase_words } from '/const/'

export function getBip32RootKey({
    seed,
    passphase = '',
    network = Bitcoin.networks.bitcoin
}) {
    const seed_raw = bip39.mnemonicToSeed(seed, passphase)
    return Bitcoin.HDNode.fromSeedHex(seed_raw, network)
}

export function getRandomMnemonic(words_number = recovery_phrase_words) {
    const strength = words_number / 3 * 32 / 8
    const randomBytes = crypto.randomBytes(strength)
    return bip39.entropyToMnemonic(randomBytes)
}

export function validateSeed(seed) {
    return bip39.validateMnemonic(seed)
}
