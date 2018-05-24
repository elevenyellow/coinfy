const crypto = require('crypto')
const bip39 = require('bip39crypto')

function getRandomMnemonic(words_number = 12) {
    const strength = words_number / 3 * 32 / 8
    const randomBytes = crypto.randomBytes(strength)
    return bip39.entropyToMnemonic(randomBytes)
}

function isValidPhrase(words) {
    for (let index = 0; index < words.length - 1; index++) {
        const word1 = words[index]
        const word2 = words[index + 1]
        const char1 = word1[0]
        const char2 = word2[0]
        const char1b = word1[1]
        const char2b = word2[1]
        if (
            char1.charCodeAt() > char2.charCodeAt() //||
            // char1b.charCodeAt() > char2b.charCodeAt()
        )
            return false
    }
    return true
}

function lettersRepeat(words) {
    const repeats = [0]
    for (let index = 0; index < words.length - 1; index++) {
        const char1 = words[index][0]
        const char2 = words[index + 1][0]
        if (char1 === char2) {
            repeats[repeats.length - 1] += 1
        } else {
            repeats.push(0)
        }
    }
    return repeats.filter(item => item > 0).map(item => item + 1)
}

function print(phrase) {
    const repeats = lettersRepeat(phrase.split(' '))
    if (repeats.length < 3) console.log(JSON.stringify(repeats), phrase)
}

while (true) {
    // phrase = 'ab aa bc'
    // 'consider country demise edit great garlic gossip sustain stove skin when wrestle'
    const phrase = getRandomMnemonic()
    const words = phrase.split(' ')
    if (isValidPhrase(words) || isValidPhrase(words.reverse())) print(phrase)
}
