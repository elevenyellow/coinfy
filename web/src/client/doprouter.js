
var dop = require('dop'),
    register = dop.register,
    set = dop.set,
    del = dop.del,
    createObserver = dop.createObserver,
    locations = [];



exports.create = function create(url) {
    var location = dop.register(parse(url))
    locations.push(location)

    // Creating observers
    var observer = createObserver(function(mutations) {
        mutations.forEach(mutation=>{
            console.log( 'mutation', mutation.prop );
        })
    })
    observer.observe(location)
    observer.observe(location.path)
    observer.observe(location.query)

    return location
}

exports.pushState = function pushState(state, title, url) {
    window.history.pushState(state, title, url)
    setUrl(url)
}





function setUrl(url) {
    locations.forEach(function(location) {
        set(location, 'href', url)
    })
}

function parse(url) {
    var match = /((.*):\/\/([^/#?]+))?([^?#]*)([^#]*)(.*)?/.exec(url),
    query = {},
    data = {
        // origin: match[1],
        // protocol: match[2],
        // host: match[3],
        pathname: match[4],
        path: match[4].split('/').filter(item => item.length>0),
        search: match[5],
        query: query,
        hash: match[6] || ''
    }
    data.href = data.pathname + data.search + data.hash

    if (data.search.length > 1) {
        data.search.substr(1).split('&').forEach(item => {
            if (item.length > 0) {
                var equal = item.indexOf('=');
                (equal > -1) ?
                    data.query[item.substr(0,equal)] = item.substr(equal+1)
                :
                    data.query[item] = ''
            }
        })
    }

    return data
}




if (window)
    window.addEventListener('popstate', function(){
        setUrl(window.location.href)
    })





// exports.Link = function(url, state, label) {
//     history.pushState(state, label, url)
//     updateUrl()
// }

// var url, urlparsed


// exports.onUpdate = function() {}


// function updateUrl() {
//     url = window.location.href
//     urlparsed = parse(url)
//     exports.onUpdate(url, urlparsed)
// }
// updateUrl()




// window.addEventListener('popstate', updateUrl)
// window.addEventListener("hashchange", updateUrl)





