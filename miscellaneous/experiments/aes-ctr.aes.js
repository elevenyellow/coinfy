var aesjs = require('aes-js')
var scrypt = require('scrypt.js')
const { randomBytes } = require('crypto')

// An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
var password = '1!@#14231dsada1321432dasda234'
var derivedKey = scrypt(new Buffer(password), randomBytes(32), 8192, 8, 1, 32)
console.log(derivedKey.toString('hex'))

// Convert text to bytes
var text = 'Text may be any length you wish, no padding is required.'
var textBytes = aesjs.utils.utf8.toBytes(text)

// The counter is optional, and if omitted will begin at 1
var aesCtr = new aesjs.ModeOfOperation.ctr(derivedKey, new aesjs.Counter(5))
var encryptedBytes = aesCtr.encrypt(textBytes)

// To print or store the binary data, you may convert it to hex
var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)
console.log(encryptedHex)
// "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
//  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788"

// When ready to decrypt the hex string, convert it back to bytes
var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex)

// The counter mode of operation maintains internal state, so to
// decrypt a new instance must be instantiated.
var aesCtr = new aesjs.ModeOfOperation.ctr(derivedKey, new aesjs.Counter(5))
var decryptedBytes = aesCtr.decrypt(encryptedBytes)

// Convert our bytes back into text
var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
console.log(decryptedText)
// "Text may be any length you wish, no padding is required."
