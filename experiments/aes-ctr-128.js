crypto = require('crypto')
scrypt = require('scryptsy')

toV3 = function(value, password, opts) {
    opts = opts || {}
    var salt = opts.salt || crypto.randomBytes(32)
    var iv = opts.iv || crypto.randomBytes(16)
    var derivedKey
    var kdf = opts.kdf || 'scrypt'
    var kdfparams = {
        dklen: opts.dklen || 32,
        salt: salt.toString('hex')
    }
    if (kdf === 'pbkdf2') {
        kdfparams.c = opts.c || 262144
        kdfparams.prf = 'hmac-sha256'
        derivedKey = crypto.pbkdf2Sync(new Buffer(password), salt, kdfparams.c, kdfparams.dklen, 'sha256')
    } else if (kdf === 'scrypt') {
        // FIXME: support progress reporting callback
        kdfparams.n = opts.n || 262144
        kdfparams.r = opts.r || 8
        kdfparams.p = opts.p || 1
        derivedKey = scrypt(new Buffer(password), salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
    } else {
        throw new Error('Unsupported kdf')
    }
    var cipher = crypto.createCipheriv(opts.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv)
    if (!cipher) {
        throw new Error('Unsupported cipher')
    }
    var ciphertext = Buffer.concat([cipher.update(value), cipher.final()])
    return {
        ciphertext: ciphertext.toString('hex'),
        cipherparams: {
            iv: iv.toString('hex')
        },
        cipher: opts.cipher || 'aes-128-ctr',
        kdf: kdf,
        kdfparams: kdfparams
    }
}
decipherBuffer = function(decipher, data) {
    return Buffer.concat([decipher.update(data), decipher.final()])
}



pwd='1234'
enc=toV3('Hola mundo', pwd, {kdf:'pbkdf2'})
console.log( enc );

// var ciphertext = new Buffer(enc.ciphertext, 'hex')
// var derivedKey = crypto.pbkdf2Sync(new Buffer(pwd), new Buffer(enc.kdfparams.salt, 'hex'), enc.kdfparams.c, enc.kdfparams.dklen, 'sha256')
// var decipher = crypto.createDecipheriv(enc.cipher, derivedKey.slice(0, 16), new Buffer(enc.cipherparams.iv, 'hex'))
// var seed = decipherBuffer(decipher, ciphertext, 'hex')
// console.log( seed.toString() );