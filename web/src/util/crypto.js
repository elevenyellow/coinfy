// import { createCipheriv } from 'browserify-cipher'


export const getPasswordStrength = (function() {

    function test(letters, regexp) {
        let count = 0
        letters.forEach(letter => {
            if (regexp.test(letter))
                count += 1
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
        if (data.lowercase>0) {
            data.score += 1
        }

        data.numbers = test(letters, /^\d$/)
        if (data.numbers>0) {
            data.score += 1
        }

        data.uppercase = test(letters, /^[A-Z]$/)
        if (data.uppercase>0) {
            data.score += 1
        }

        data.specials = test(letters, /^[^A-Za-z0-9]$/)
        if (data.specials>0) {
            data.score += 1
        }

        if (data.length<minlength)
            data.score = 0


        if (messages && typeof messages == 'object') {
            let messages_order = [
                'length',
                'lowercase',
                'numbers',
                'uppercase',
                'specials',
            ]
            for (let index=0,total=messages_order.length; index<total; ++index) {
                if (
                    (messages_order[index] === 'length' && data.length<minlength) ||
                    data[messages_order[index]] === 0
                ) {
                    data.message = messages[messages_order[index]]
                    break
                }
            }
        }

        return data
    }
})();

// - Very Weak "" // 0 rojo
// - Weak "jos" // 1 naranja
// - Medium "Jos" // 2 amarillo
// - Good "Jos1" // 3 verde claro
// - Excelent "Jos1" // 4 verde

// http://www.passwordmeter.com/
