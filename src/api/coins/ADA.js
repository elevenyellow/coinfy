const bip39 = require('bip39crypto')
const blakejs = require('blakejs')
const cbor = require('cbor')
const crypto = require('crypto')
const { eddsa: EdDsa } = require('elliptic-cardano')
const ec = new EdDsa('ed25519')
const { pbkdf2 } = require('pbkdf2')
const chacha20 = require('@stablelib/chacha20poly1305')
const bigNumber = require('bignumber.js')
const sha3 = require('js-sha3')
const base58 = require('bs58')
const crc32 = require('crc-32')

const HARDENED_THRESHOLD = 0x80000000
const seed1 =
    'civil void tool perfect avocado sweet immense fluid arrow aerobic boil flash'
const seed2 =
    'category age design kid snow ketchup give upper toe destroy various concert'
const hdnode = mnemonicToHdNode(seed2)
const addrtomatch =
    'DdzFFzCqrht9rXNV1cKD8gmVpi1WZa3cGGrm5i5S3XWaiWs8jMR8kMZwx395J5zLYmrE4HnRRQhdAYEUmP5YXvGPYJKWB18uvfsCSiqa'
;('DdzFFzCqrhtCSHdvs127P4YXTea9QQbmj7FhJo4fTWS2R8bQEMj1WS8kedBN1mD7ivb1a6XN1XoXFJv7W9hAV6ewrP5zD3U4VqYJ52ZW')

async function go() {
    let addr
    for (let i = 2147400000; i < 2147499999; i++) {
        addr = await deriveAddressWithHdNode(hdnode, i)
        if (addrtomatch === addr.address) console.log(addr.address)
    }
}
go()

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
    return Buffer.from(blakejs.blake2b(cbor.encode(input), null, 32))
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

async function deriveAddressWithHdNode(parentHdNode, childIndex) {
    let addressPayload, addressAttributes, derivedHdNode

    if (childIndex === HARDENED_THRESHOLD) {
        // root address
        addressPayload = Buffer.from([])
        addressAttributes = new Map()
        derivedHdNode = parentHdNode
    } else {
        // the remaining addresses
        const hdPassphrase = await deriveHdPassphrase(parentHdNode)
        const derivationPath = [HARDENED_THRESHOLD, childIndex]

        addressPayload = encryptDerivationPath(derivationPath, hdPassphrase)
        addressAttributes = new Map([[1, cbor.encode(addressPayload)]])
        derivedHdNode = deriveHdNode(parentHdNode, childIndex)
    }
    const addressRoot = getAddressRoot(derivedHdNode, addressPayload)

    const addressType = 0 // Public key address

    const addressData = [addressRoot, addressAttributes, addressType]

    const addressDataEncoded = cbor.encode(addressData)

    const address = base58.encode(
        cbor.encode([
            new cbor.Tagged(24, addressDataEncoded),
            crc32Unsigned(addressDataEncoded)
        ])
    )

    return {
        address,
        childIndex,
        hdNode: derivedHdNode
    }
}

async function deriveHdPassphrase(hdNode) {
    return await pbkdf2Async(
        hdNode.getExtendedPublicKey(),
        'address-hashing',
        500,
        32,
        'sha512'
    )
}

async function pbkdf2Async(password, salt, iterations, length, algo) {
    return await new Promise((resolveFunction, rejectFunction) => {
        pbkdf2(password, salt, iterations, length, algo, (error, response) => {
            if (error) {
                rejectFunction(error)
            }
            resolveFunction(response)
        })
    })
}

function encryptDerivationPath(derivationPath, hdPassphrase) {
    const serializedDerivationPath = cbor.encode(
        new CborIndefiniteLengthArray(derivationPath)
    )

    const cipher = new chacha20.ChaCha20Poly1305(hdPassphrase)

    return Buffer.from(
        cipher.seal(Buffer.from('serokellfore'), serializedDerivationPath)
    )
}

class CborIndefiniteLengthArray {
    constructor(elements) {
        this.elements = elements
    }

    encodeCBOR(encoder) {
        return encoder.push(
            Buffer.concat([
                Buffer.from([0x9f]), // indefinite array prefix
                ...this.elements.map(e => cbor.encode(e)),
                Buffer.from([0xff]) // end of array
            ])
        )
    }
}
function deriveHdNode(hdNode, childIndex) {
    const firstRound = deriveHdNodeIteration(hdNode, HARDENED_THRESHOLD)

    if (childIndex === HARDENED_THRESHOLD) {
        throw new Error('Do not use deriveHdNode to derive root node')
    }

    return deriveHdNodeIteration(firstRound, childIndex)
}

function deriveHdNodeIteration(hdNode, childIndex) {
    const chainCode = hdNode.getChainCode()

    const hmac1 = crypto.createHmac('sha512', chainCode)

    if (indexIsHardened(childIndex)) {
        hmac1.update(Buffer.from([0x00])) // TAG_DERIVE_Z_HARDENED
        hmac1.update(hdNode.getSecretKey())
    } else {
        hmac1.update(Buffer.from([0x02])) // TAG_DERIVE_Z_NORMAL
        hmac1.update(hdNode.getPublicKey())
    }
    hmac1.update(Buffer.from(childIndex.toString(16).padStart(8, '0'), 'hex'))
    const z = Buffer.from(hmac1.digest('hex'), 'hex')

    const zl8 = multiply8(z, Buffer.from([0x08])).slice(0, 32)
    const parentKey = hdNode.getSecretKey()

    const kl = scalarAdd256ModM(zl8, parentKey.slice(0, 32))
    const kr = add256NoCarry(z.slice(32, 64), parentKey.slice(32, 64))

    const resKey = Buffer.concat([kl, kr])

    const hmac2 = crypto.createHmac('sha512', chainCode)

    if (indexIsHardened(childIndex)) {
        hmac2.update(Buffer.from([0x01])) // TAG_DERIVE_CC_HARDENED
        hmac2.update(hdNode.getSecretKey())
    } else {
        hmac2.update(Buffer.from([0x03])) // TAG_DERIVE_CC_NORMAL
        hmac2.update(hdNode.getPublicKey())
    }
    hmac2.update(Buffer.from(childIndex.toString(16).padStart(8, '0'), 'hex'))

    const newChainCode = Buffer.from(hmac2.digest('hex').slice(64, 128), 'hex')
    const newPublicKey = Buffer.from(
        ec.keyFromSecret(resKey.toString('hex').slice(0, 64)).getPublic('hex'),
        'hex'
    )

    return new HdNode({
        secretKey: resKey,
        publicKey: newPublicKey,
        chainCode: newChainCode
    })
}

function indexIsHardened(childIndex) {
    return !!(childIndex >> 31)
}

function multiply8(buf) {
    let result = ''
    let prevAcc = 0

    for (let i = 0; i < buf.length; i++) {
        result += ((((buf[i] * 8) & 0xff) + (prevAcc & 0x8)) & 0xff)
            .toString(16)
            .padStart(2, '0')
        prevAcc = buf[i] * 32
    }

    return Buffer.from(result, 'hex')
}

function scalarAdd256ModM(b1, b2) {
    let resultAsHexString = bigNumber(toLittleEndian(b1.toString('hex')), 16)
        .plus(bigNumber(toLittleEndian(b2.toString('hex')), 16))
        .mod(
            bigNumber(
                '1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed',
                16
            )
        )
        .toString(16)
    resultAsHexString = toLittleEndian(resultAsHexString).padEnd(64, '0')

    return Buffer.from(resultAsHexString, 'hex')
}
function toLittleEndian(str) {
    // from https://stackoverflow.com/questions/7946094/swap-endianness-javascript
    const s = str.replace(/^(.(..)*)$/, '0$1') // add a leading zero if needed
    const a = s.match(/../g) // split number in groups of two
    a.reverse() // reverse the goups
    return a.join('') // join the groups back together
}

function add256NoCarry(b1, b2) {
    let result = ''

    for (let i = 0; i < 32; i++) {
        result += ((b1[i] + b2[i]) & 0xff).toString(16).padStart(2, '0')
    }

    return Buffer.from(result, 'hex')
}

function getAddressRoot(hdNode, addressPayload) {
    const extendedPublicKey = hdNode.getExtendedPublicKey()

    return addressHash([
        0,
        [0, extendedPublicKey],
        addressPayload.length > 0
            ? new Map([[1, cbor.encode(addressPayload)]])
            : new Map()
    ])
}

function addressHash(input) {
    const serializedInput = cbor.encode(input)

    const firstHash = Buffer.from(sha3.sha3_256(serializedInput), 'hex')
    return Buffer.from(blakejs.blake2b(firstHash, null, 28))
}

const crc32Unsigned = input => crc32.buf(input) >>> 0
