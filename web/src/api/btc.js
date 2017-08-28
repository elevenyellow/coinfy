import Bitcoin from 'bitcoinjs-lib'


const privateKeyPrefix = 0x80; // mainnet 0x80    testnet 0xEF


export function generateRandomWallet() {
    const wallet = Bitcoin.ECPair.makeRandom()
    return { address:wallet.getAddress(), private_key:wallet.toWIF()}
}

export function isAddress(address) {
    return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)
}

export function isPublicKey(public_key) {
    return /^([0-9a-fA-F]{66}|[0-9a-fA-F]{130})$/.test(public_key)
}

export function isPrivateKey(private_key) {
    return (
        isWalletImportFormat(private_key) ||
        isCompressedWalletImportFormat(private_key)
        // isHexFormat(private_key) ||
        // isBase64Format(private_key)
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
           
export function getAddressFromPrivateKey(private_key) {
    const wallet = Bitcoin.ECPair.fromWIF(private_key)
    return wallet.getAddress().toString()
}


export function getAddressFromPublicKey(public_key) {
    const publicKeyBuffer = new Buffer(public_key, 'hex')
    const wallet = Bitcoin.ECPair.fromPublicKeyBuffer(publicKeyBuffer)
    return wallet.getAddress().toString()
    // console.log(new Bitcoin.ECPair(null, wallet.Q, { compressed: true }).getAddress())
    // console.log(new Bitcoin.ECPair(null, wallet.Q, { compressed: false }).getAddress())
}

export function getAllFormats(wallet) {
    const formats = {}
    if (typeof wallet == 'string')
        wallet = Bitcoin.ECPair.fromWIF(wallet)
    wallet.compressed = false
    formats.address = wallet.getAddress()
    formats.public_key = wallet.getPublicKeyBuffer().toString('hex')
    formats.private_key = wallet.toWIF()
    wallet.compressed = true
    formats.address_comp = wallet.getAddress()
    formats.public_key_comp = wallet.getPublicKeyBuffer().toString('hex')
    formats.private_key_comp = wallet.toWIF()
    return formats
}





/*
// To allow: https://www.bitaddress.org
Private Key Hexadecimal Format (64 characters [0-9A-F]):
Private Key Base64 (44 characters):


export function isHexFormat(key) {
    key = key.toString();
    return /^[A-Fa-f0-9]{64}$/.test(key);
}


export function isBase64Format(key) {
    key = key.toString();
    return (/^[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=+\/]{44}$/.test(key));
}



function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

function base64ToBytes(base64) {
    // Remove non-base-64 characters
    var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

    for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
        (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
    }

    return bytes;
}


function getBitcoinWalletImportFormat(bytes) {
    if (bytes == null) return "";
    bytes.unshift(privateKeyPrefix); // prepend 0x80 byte
    var checksum = Crypto.SHA256(Crypto.SHA256(bytes, { asBytes: true }), { asBytes: true });
    bytes = bytes.concat(checksum.slice(0, 4));
    var privWif = Bitcoin.Base58.encode(bytes);
    return privWif;
};

function getBitcoinPrivateKeyByteArray(priv) {
    if (priv == null) return null;
    // Get a copy of private key as a byte array
    var bytes = priv.toByteArrayUnsigned();
    // zero pad if private key is less than 32 bytes 
    while (bytes.length < 32) bytes.unshift(0x00);
    return bytes;
};
*/