
function parse(url) {
    var data = {},
        resu = /(.*):\/\/([^/#?]+)([^?#]*)([^#]*)(.*)?/.exec(url)
    
    data.href = url
    data.protocol = resu[1]
    data.host = resu[2]
    data.pathname = resu[3]
    data.search = resu[4]
    data.hash = resu[5] || ''
    return data
}
console.log(   parse('http://localhost:8000?#dafs=daf') )




// function onChange(e) {
//     console.log( e );
// }

// window.addEventListener('popstate', onChange)

// exports.getRoute = function(url) {
//     return url.replace(/.*:\/\/([^/#?]+\/?)(#|\?)?/, '$2');
// }

// exports.link = function(url, state, label) {
//     history.pushState(state, label, url)
// }