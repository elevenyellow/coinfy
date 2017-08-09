
let dop = require('dop'),
    register = dop.register,
    set = dop.set,
    del = dop.del,
    collect = dop.collect,
    intercept = dop.intercept,
    locations = [];



export function create(url) {

    let shallWeEmit = false
    let location = register(parse(url))
    let disposeInterceptor = intercept(location, mutation => {

        if (!shallWeEmit) {

            if (mutation.prop === 'href') {
                pushState(mutation.value)
                setHref(getWindowLocation())
            }

        }

        return shallWeEmit

    })



    function setHref(href) {
        let newlocation = parse(href)
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





    if (window) {
        window.addEventListener('popstate', function(){
            setHref(getWindowLocation())
        })
    }


    locations.push(location)
    return location
}



function pushState(url, state, title) {
    window.history.pushState(state, title, url)
}

function getWindowLocation() {
    // if nodejs ... todo
    return window.location.href
}

function getHref(location) {
    return location.pathname + location.search + location.hash
}


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
