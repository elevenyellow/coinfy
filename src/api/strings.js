export function padLeft(n, width, z) {
    z = z || '0'
    n = n + ''
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

// // Usage: console.log( string.supplant("${v|Hola} mundo ${v2}", ${v:"Hola"}, ${v2:"cruel"}) );
// export function supplant(str) {
//     let args = arguments,
//         t = args.length - 1,
//         i = 1

//     return (function _supplant(i) {
//         str = str.replace(/\${([^{}]*)}/g, function(a, wordoptions) {
//             // Spliting options
//             let words = wordoptions.split('|')

//             // Picking random word
//             let word =
//                 words.length > 1
//                     ? words[Math.floor(Math.random() * words.length)]
//                     : words[0]

//             // Grabing
//             let parse = args[i][word]
//             let tof = typeof parse
//             return tof === 'string' || tof === 'number' ? parse : word
//         })
//         if (i < t) return _supplant(i + 1)

//         return str
//     })(i)
// }
