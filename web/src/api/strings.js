// Usage: console.log( string.supplant("{{v|Hola}} mundo {{v2}}", {{v:"Hola"}}, {{v2:"cruel"}}) );
export function supplant(str) {
    
    var args = arguments,
        t = args.length-1,
        i = 1;

    if (t === 0)
        return str

    return (function _supplant(i) {
        str = str.replace(/{{([^{}]*)}}/g,
            function (a, wordoptions) {

                // Spliting options
                var words = wordoptions.split('|');

                // Picking random word
                var word = (words.length > 1) ? words[Math.floor(Math.random()*(words.length))] : words[0];

                // Grabing
                var parse = args[i][word];
                var tof = typeof parse;
                return tof === 'string' || tof === 'number' ? parse : word;
            }
        );
        if (i<t)
            return _supplant(i+1);

        return str;
    })(i);
}