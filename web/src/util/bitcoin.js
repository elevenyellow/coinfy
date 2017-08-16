import bitcoin from 'bitcoinjs-lib'

export function generateRandomWallet() {
    const wallet = bitcoin.ECPair.makeRandom()
    return { address:wallet.getAddress(), private_key:wallet.toWIF()}
}