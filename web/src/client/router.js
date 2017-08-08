var url, urlparsed

exports.getUrl = function() {
    return url
}

exports.getUrlParsed = function() {
    return urlparsed
}

exports.Link = function(url, state, label) {
    history.pushState(state, label, url)
    updateUrl()
}

exports.onUpdate = function() {}


function updateUrl() {
    url = window.location.href
    urlparsed = parse(url)
    exports.onUpdate(url, urlparsed)
}
updateUrl()




window.addEventListener('popstate', updateUrl)
// window.addEventListener("hashchange", updateUrl)


function parse(url) {
    var resu = /(.*):\/\/([^/#?]+)([^?#]*)([^#]*)(.*)?/.exec(url),
    query = {},
    data = {
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




