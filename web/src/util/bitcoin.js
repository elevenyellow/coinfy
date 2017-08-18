import Bitcoin from 'bitcoinjs-lib'

const privateKeyPrefix = 0x80; // mainnet 0x80    testnet 0xEF


export function generateRandomWallet() {
    const wallet = Bitcoin.ECPair.makeRandom()
    return { address:wallet.getAddress(), private_key:wallet.toWIF()}
}

export function isAddress(address) {
    return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)
}

// https://github.com/pointbiz/bitaddress.org/blob/67e167930c4ebd9cf91047c36792c4e32dc41f11/src/ninja.key.js
export function isPrivateKey(private_key) {
    return (
        isWalletImportFormat(private_key) ||
        isCompressedWalletImportFormat(private_key) ||
        isHexFormat(private_key) ||
        isBase64Format(private_key)
    );
}


export function isWalletImportFormat(key) {
    key = key.toString();
    return (privateKeyPrefix == 0x80) ?
        (/^5[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$/.test(key))
    :
        (/^9[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$/.test(key))
}

export function isCompressedWalletImportFormat(key) {
    key = key.toString();
    return (privateKeyPrefix == 0x80) ?
        (/^[LK][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{51}$/.test(key))
    :
        (/^c[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{51}$/.test(key));
}
                        

export function isHexFormat(key) {
    key = key.toString();
    return /^[A-Fa-f0-9]{64}$/.test(key);
}


export function isBase64Format(key) {
    key = key.toString();
    return (/^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=+\/]{44}$/.test(key));
}

