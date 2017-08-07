
function parse(url) {
    var resu = /(.*):\/\/([^/#?]+)([^?#]*)([^#]*)(.*)?/.exec(url)
    var query = {}
    var data = {
        href: url,
        protocol: resu[1],
        host: resu[2],
        pathname: resu[3],
        path: resu[3].split('/').filter(function (item) { return item.length>0 }),
        search: resu[4],
        query: query,
        hash: resu[5] || ''
    }

    if (data.search.length > 1) {
        data.search.substr(1).split('&').forEach(function(item) {
            if (item.length > 0) {
                var equal = item.indexOf('=')
                if (equal > -1)
                    data.query[item.substr(0,equal)] = item.substr(equal+1)
                else
                    data.query[item] = ''
            }
        })
    }


    return data
}
console.log(   parse('http://localhost:8000/wendios/peri/?A=123&B&=C&#molando') )




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