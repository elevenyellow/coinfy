const {
    pbkdf2Sync,
    randomBytes,
    createCipheriv,
    createDecipheriv
} = require('crypto')
const scrypt = require('scrypt.js') // or from 'scryptsy'
const { sha3 } = require('ethereumjs-util')

function encryptAES128CTR(string, password, hex = false, mac = true) {
    const string_buffer = new Buffer(string, hex ? 'hex' : undefined) // ethereum: new Buffer(string,'hex')
    const ciphertype = 'aes-128-ctr'
    const salt = randomBytes(32)
    const iv = randomBytes(16)
    const kdf = 'scrypt'
    const kdfparams = {
        dklen: 32,
        salt: salt.toString('hex'),
        n: 8192,
        r: 8,
        p: 1
    }

    const derivedKey = scrypt(
        new Buffer(password),
        salt,
        kdfparams.n,
        kdfparams.r,
        kdfparams.p,
        kdfparams.dklen
    )
    const cipher = createCipheriv(ciphertype, derivedKey.slice(0, 16), iv)
    if (!cipher) throw new Error('Unsupported cipher')

    const ciphertext = Buffer.concat([
        cipher.update(string_buffer),
        cipher.final()
    ])

    const private_key = {
        ciphertext: ciphertext.toString('hex'),
        cipherparams: {
            iv: iv.toString('hex')
        },
        cipher: ciphertype,
        kdf: kdf,
        kdfparams: kdfparams
    }

    if (mac) {
        private_key.mac = sha3(
            Buffer.concat([
                derivedKey.slice(16, 32),
                new Buffer(ciphertext, 'hex')
            ])
        ).toString('hex')
    }

    // console.log(JSON.stringify(private_key))

    return private_key
}

function decryptAES128CTR(encryption, password, hex = false) {
    const ciphertype = 'aes-128-ctr'
    const ciphertext = new Buffer(encryption.ciphertext, 'hex')
    const derivedKey =
        encryption.kdf === 'scrypt'
            ? scrypt(
                  new Buffer(password),
                  new Buffer(encryption.kdfparams.salt, 'hex'),
                  encryption.kdfparams.n,
                  encryption.kdfparams.r,
                  encryption.kdfparams.p,
                  encryption.kdfparams.dklen
              )
            : pbkdf2Sync(
                  new Buffer(password),
                  new Buffer(encryption.kdfparams.salt, 'hex'),
                  encryption.kdfparams.c,
                  encryption.kdfparams.dklen,
                  'sha256'
              )

    const mac = sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
    if (mac.toString('hex') !== encryption.mac) {
        throw new Error('Key derivation failed - possibly wrong passphrase')
    }

    const decipher = createDecipheriv(
        ciphertype,
        derivedKey.slice(0, 16),
        new Buffer(encryption.cipherparams.iv, 'hex')
    )
    let seed = Buffer.concat([decipher.update(ciphertext), decipher.final()])
    while (seed.length < 32) seed = Buffer.concat([new Buffer([0x00]), seed])

    return seed.toString(hex ? 'hex' : undefined) //ethereum seed.toString('hex')
}

const pwd = '1234'
const enc = encryptAES128CTR('Hola Mundo', pwd)
const dec = decryptAES128CTR(enc, pwd)
console.log(dec)
