import { createCipheriv, createDecipheriv } from 'browserify-cipher'
import pbkdf2 from 'pbkdf2'
import scrypt from '/../util/scrypt'

function toV3(value, password, opts) {
    opts = opts || {}
    var salt = opts.salt || randomBytes(32)
    var iv = opts.iv || randomBytes(16)
    var derivedKey
    var kdf = opts.kdf || 'scrypt'
    var kdfparams = {
        dklen: opts.dklen || 32,
        salt: salt.toString('hex')
    }
    if (kdf === 'pbkdf2') {
        kdfparams.c = opts.c || 262144
        kdfparams.prf = 'hmac-sha256'
        derivedKey = pbkdf2.pbkdf2Sync(new Buffer(password), salt, kdfparams.c, kdfparams.dklen, 'sha256')
    } else if (kdf === 'scrypt') {
        // FIXME: support progress reporting callback
        kdfparams.n = opts.n || 1024
        kdfparams.r = opts.r || 8
        kdfparams.p = opts.p || 1
        derivedKey = scrypt(new Buffer(password), salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
    } else {
        throw new Error('Unsupported kdf')
    }
    var cipher = createCipheriv(opts.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv)
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
function decipherBuffer(decipher, data) {
    return Buffer.concat([decipher.update(data), decipher.final()])
}


function randomBytes (size) {
  // in case browserify  isn't using the Uint8Array version
  var rawBytes = new global.Uint8Array(size)
  // This will not work in older browsers.
  // See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
  if (size > 0) {  // getRandomValues fails on IE if size == 0
    crypto.getRandomValues(rawBytes)
  }
  // XXX: phantomjs doesn't like a buffer being passed here
  return Buffer.from(rawBytes.buffer)
}


// pwd='1234'
// enc=toV3('Hola mundo', pwd, {kdf:'pbkdf2'})
// console.log( enc );

// var ciphertext = new Buffer(enc.ciphertext, 'hex')
// var derivedKey = pbkdf2.pbkdf2Sync(new Buffer(pwd), new Buffer(enc.kdfparams.salt, 'hex'), enc.kdfparams.c, enc.kdfparams.dklen, 'sha256')
// var decipher = createDecipheriv(enc.cipher, derivedKey.slice(0, 16), new Buffer(enc.cipherparams.iv, 'hex'))
// var seed = decipherBuffer(decipher, ciphertext, 'hex')
// console.log( seed.toString() );


window.go = function(){

var password='holamundo'
var enc=toV3('If the text is very very long?', password)
console.log( enc );

var ciphertext = new Buffer(enc.ciphertext, 'hex')
var derivedKey = scrypt(new Buffer(password), new Buffer(enc.kdfparams.salt, 'hex'), enc.kdfparams.n, enc.kdfparams.r, enc.kdfparams.p, enc.kdfparams.dklen)
var decipher = createDecipheriv(enc.cipher, derivedKey.slice(0, 16), new Buffer(enc.cipherparams.iv, 'hex'))
var seed = decipherBuffer(decipher, ciphertext, 'hex')
console.log( 'DECRYPTED yeah!', seed.toString() );

}












