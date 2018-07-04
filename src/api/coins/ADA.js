const bip39 = require('bip39crypto')
const blake2 = require('blakejs')
const cbor = require('cbor')
const crypto = require('crypto')
const { eddsa: EdDsa } = require('elliptic-cardano')
const ec = new EdDsa('ed25519')

console.log(
    mnemonicToHdNode(
        'civil void tool perfect avocado sweet immense fluid arrow aerobic boil flash'
    )
)

function mnemonicToHdNode(mnemonic) {
    const hashSeed = mnemonicToHashSeed(mnemonic)
    let result

    for (let i = 1; result === undefined && i <= 1000; i++) {
        const hmac = crypto.createHmac('sha512', hashSeed)
        hmac.update(`Root Seed Chain ${i}`)

        const digest = hmac.digest('hex')

        const secret = Buffer.from(digest.substr(0, 64), 'hex')

        try {
            const secretKey = extendSecretToSecretKey(secret)
            const publicKey = Buffer.from(
                ec.keyFromSecret(secret.toString('hex')).getPublic('hex'),
                'hex'
            )

            const chainCode = Buffer.from(digest.substr(64, 64), 'hex')

            result = new HdNode({ secretKey, publicKey, chainCode })
        } catch (e) {
            if (e.name === 'InvalidArgumentException') {
                continue
            }

            throw e
        }
    }

    if (result === undefined) {
        const e = new Error(
            'Secret key generation from mnemonic is looping forever'
        )
        e.name = 'RuntimeException'
        throw e
    }

    return result
}

function mnemonicToHashSeed(mnemonic) {
    if (!validateMnemonic(mnemonic)) {
        const e = new Error('Invalid or unsupported mnemonic format')
        e.name = 'InvalidArgumentException'
        throw e
    }

    const ent = Buffer.from(bip39.mnemonicToEntropy(mnemonic), 'hex')

    return cbor.encode(hashBlake2b256(ent))
}

function validateMnemonic(mnemonic) {
    try {
        return !!mnemonic && bip39.validateMnemonic(mnemonic)
    } catch (e) {
        return false
    }
}

function hashBlake2b256(input) {
    return Buffer.from(blake2.blake2b(cbor.encode(input), null, 32))
}

function extendSecretToSecretKey(secret) {
    const sha512 = crypto.createHash('sha512')

    sha512.update(secret)

    const hashResult = Buffer.from(sha512.digest('hex'), 'hex')

    hashResult[0] &= 248
    hashResult[31] &= 127
    hashResult[31] |= 64

    if (hashResult[31] & 0x20) {
        const e = new Error('Invalid secret')
        e.name = 'InvalidArgumentException'
        throw e
    }

    return hashResult
}

function HdNode({ secretKey, publicKey, chainCode, hdNodeString }) {
    if (hdNodeString) {
        this.secretKey = Buffer.from(hdNodeString.substr(0, 128), 'hex')
        this.publicKey = Buffer.from(hdNodeString.substr(128, 64), 'hex')
        this.chainCode = Buffer.from(hdNodeString.substr(192, 64), 'hex')
    } else {
        this.secretKey = secretKey
        this.publicKey = publicKey
        this.chainCode = chainCode
    }
    this.extendedPublicKey = Buffer.concat([this.publicKey, this.chainCode], 64)

    this.getSecretKey = function() {
        return this.secretKey
    }

    this.getPublicKey = function() {
        return this.publicKey
    }

    this.getChainCode = function() {
        return this.chainCode
    }

    this.getExtendedPublicKey = function() {
        return this.extendedPublicKey
    }
}
