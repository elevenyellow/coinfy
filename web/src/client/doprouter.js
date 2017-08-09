
let dop = require('dop'),
    register = dop.register,
    set = dop.set,
    del = dop.del,
    collect = dop.collect,
    intercept = dop.intercept,
    locations = [];



export function create(url) {

    let shallWeEmit = false
    let shallWePush = true
    let location = register(parse(url))
    let disposeInterceptor = intercept(location, mutation => {

        if (!shallWeEmit) {

            if (mutation.prop === 'href') {
                if (shallWePush)
                    pushState(mutation.value)
                let newlocation = parse(window.location.href)
                newlocation.href = getHref(newlocation)
                let collector = collect()
                shallWeEmit = true
                set(location, 'href', newlocation.href)
                set(location, 'pathname', newlocation.pathname)
                set(location, 'search', newlocation.search)
                set(location, 'hash', newlocation.hash)
                shallWeEmit = false
                collector.emit()
            }

        }

        return shallWeEmit

    })

    if (window) {
        window.addEventListener('popstate', function(){
            shallWePush = false
            set(location, 'href', window.location.href)
            shallWePush = true
        })
    }


    locations.push(location)
    return location
}



function pushState(url, state, title) {
    window.history.pushState(state, title, url)
}


// function setUrl(url) {
//     locations.forEach(location => {
//         set(location, 'href', url)
//     })
// }


function parse(url) {
    let match = /((.*):\/\/([^/#?]+))?([^?#]*)([^#]*)(.*)?/.exec(url),
    query = {},
    location = {
        // origin: match[1],
        // protocol: match[2],
        // host: match[3],
        pathname: match[4],
        // path: match[4].split('/').filter(item => item.length>0),
        search: match[5],
        // query: query,
        hash: match[6] || ''
    }
    location.href = getHref(location)



    // if (location.search.length > 1) {
    //     location.search.substr(1).split('&').forEach(item => {
    //         if (item.length > 0) {
    //             let equal = item.indexOf('=');
    //             (equal > -1) ?
    //                 location.query[item.substr(0,equal)] = item.substr(equal+1)
    //             :
    //                 location.query[item] = ''
    //         }
    //     })
    // }

    return location
}

function getHref(location) {
    return location.pathname + location.search + location.hash
}















    // exports.pushState = function pushState(state, title, url) {
//     pushState(url, state, title)
//     setUrl(url)
// }

// exports.Link = function(url, state, label) {
//     history.pushState(state, label, url)
//     updateUrl()
// }

// let url, urlparsed


// exports.onUpdate = function() {}


// function updateUrl() {
//     url = window.location.href
//     urlparsed = parse(url)
//     exports.onUpdate(url, urlparsed)
// }
// updateUrl()




// window.addEventListener('popstate', updateUrl)
// window.addEventListener("hashchange", updateUrl)





