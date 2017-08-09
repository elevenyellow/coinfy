import { register, set, del, collect, intercept, getObjectTarget } from 'dop'

export function create(url) {

    let shallWeEmit = false
    let location = register(parse(url))
    let disposeInterceptor = intercept(location, mutation => {

        if (!shallWeEmit) {

            if (mutation.prop === 'href') {
                dop.getObjectTarget(mutation.object).href = mutation.oldValue
                pushState(mutation.value)
                setHref(getWindowLocation())
            }


            else if (mutation.prop === 'pathname') {
                let value = mutation.value.split('/').map(encodeURIComponent).join('/')
                if (mutation.value[0]!=='/')
                    value = '/' + value
                value = value + location.search + location.hash
                dop.getObjectTarget(mutation.object).pathname = mutation.oldValue
                pushState(value)
                setHref(getWindowLocation())
            }


            else if (mutation.prop === 'search') {
                let value = mutation.value[0]==='?' ? mutation.value.substr(1) : mutation.value
                value = value
                    .split('&')
                    .map(param=>{
                        let splited = param.split('=')
                        param = encodeURIComponent(splited[0]||'')
                        if (splited.hasOwnProperty(1))
                            param += '='+encodeURIComponent(splited[1]) 
                        return param
                    })
                    .join('&')

                value = location.pathname + '?' + value + location.hash
                dop.getObjectTarget(mutation.object).search = mutation.oldValue
                pushState(value)
                setHref(getWindowLocation())
            }

            else if (mutation.prop === 'hash') {
                let value = mutation.value[0]==='#' ? mutation.value : '#' + mutation.value
                value = location.pathname + location.search + value
                dop.getObjectTarget(mutation.object).hash = mutation.oldValue
                pushState(value)
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




    // when user click back/forward on browser or change the hash
    if (window)
        window.addEventListener('popstate', function(){
            setHref(getWindowLocation())
        })


    return location
}



function pushState(url, state, title) {
    // if nodejs ... todo
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
