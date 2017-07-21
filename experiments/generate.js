var bitcoin = require('bitcoinjs-lib')

var keyPair = bitcoin.ECPair.makeRandom()

// Print your private key (in WIF format)
console.log(keyPair.toWIF())
// => Kxr9tQED9H44gCmp6HAdmemAzU3n84H3dGkuWTKvE23JgHMW8gct

// Print your public key address
console.log(keyPair.getAddress())
// => 14bZ7YWde4KdRb5YN7GYkToz3EHVCvRxkF