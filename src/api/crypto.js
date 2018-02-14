import {
    pbkdf2Sync,
    randomBytes,
    createCipheriv,
    createDecipheriv
} from 'crypto'
import bip38 from 'bip38'
import wif from 'wif'
import scrypt from 'scryptsy' // or from 'scryptsy'
import { sha3 } from 'ethereumjs-util'

export { randomBytes } from 'crypto'

// https://crypto.stackexchange.com/questions/55014/how-insecure-is-aes-128-ctr-to-encrypt-any-kind-of-data-using-the-ethereum-keyst
export function encryptAES128CTR(string, password, isHex = false, mac = false) {
    const string_buffer = new Buffer(string, isHex ? 'hex' : undefined) // ethereum: new Buffer(string,'hex')
    const ciphertype = 'aes-128-ctr'
    const salt = randomBytes(32)
    const iv = randomBytes(16)
    const kdf = 'scrypt'
    const kdfparams = {
        dklen: 32,
        salt: salt.toString('hex'),
        n: 1024 * 8,
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

export function decryptAES128CTR(encryption, password, isHex = false) {
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

    // if (typeof encryption.mac == 'string') {
    //     const mac = sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
    //     if (mac.toString('hex') !== encryption.mac)
    //         throw new Error('Key derivation failed - possibly wrong passphrase')
    // }

    const decipher = createDecipheriv(
        ciphertype,
        derivedKey.slice(0, 16),
        new Buffer(encryption.cipherparams.iv, 'hex')
    )
    let seed = Buffer.concat([decipher.update(ciphertext), decipher.final()])

    // https://stackoverflow.com/questions/48788874/convert-buffer-into-regular-string
    if (isHex)
        while (seed.length < 32)
            seed = Buffer.concat([new Buffer([0x00]), seed])

    return seed.toString(isHex ? 'hex' : undefined) //ethereum seed.toString('hex')
}

export function encryptBIP38(privateKey, password, progressCallback) {
    let decoded = wif.decode(privateKey)
    return bip38.encrypt(
        decoded.privateKey,
        decoded.compressed,
        password,
        progressCallback
    )
}

export function decryptBIP38(encryptedKey, password, progressCallback, prefix) {
    let decryptedKey = bip38.decrypt(encryptedKey, password, progressCallback)
    return wif.encode(prefix, decryptedKey.privateKey, decryptedKey.compressed)
}

export const getPasswordStrength = (function() {
    function test(letters, regexp) {
        let count = 0
        letters.forEach(letter => {
            if (regexp.test(letter)) count += 1
        })
        return count
    }

    return function(password, minlength, messages) {
        let letters = password.split('')
        let data = {
            length: password.length,
            maxscore: 4,
            score: 0,
            lowercase: 0,
            numbers: 0,
            uppercase: 0,
            specials: 0
        }

        data.lowercase = test(letters, /^[a-z]$/)
        if (data.lowercase > 0) {
            data.score += 1
        }

        data.numbers = test(letters, /^\d$/)
        if (data.numbers > 0) {
            data.score += 1
        }

        data.uppercase = test(letters, /^[A-Z]$/)
        if (data.uppercase > 0) {
            data.score += 1
        }

        data.specials = test(letters, /^[^A-Za-z0-9]$/)
        if (data.specials > 0) {
            data.score += 1
        }

        if (data.length < minlength) data.score = 0

        if (messages && typeof messages == 'object') {
            let messages_order = [
                'length',
                'lowercase',
                'numbers',
                'uppercase',
                'specials'
            ]
            for (
                let index = 0, total = messages_order.length;
                index < total;
                ++index
            ) {
                if (
                    (messages_order[index] === 'length' &&
                        data.length < minlength) ||
                    data[messages_order[index]] === 0
                ) {
                    data.message = messages[messages_order[index]]
                    break
                }
            }
        }

        return data
    }
})()

// - Very Weak "" // 0 rojo
// - Weak "jos" // 1 naranja
// - Medium "Jos" // 2 amarillo
// - Good "Jos1" // 3 verde claro
// - Excelent "Jos1" // 4 verde

// http://www.passwordmeter.com/

// export function randomBytes(size) {
//     var rawBytes = new global.Uint8Array(size)
//     // This will not work in older browsers: https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
//     if (size > 0)
//         // getRandomValues fails on IE if size == 0
//         crypto.getRandomValues(rawBytes)
//     return Buffer.from(rawBytes.buffer)
// }
