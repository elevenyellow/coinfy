import { register, set, del, collect, intercept, getObjectTarget } from 'dop'

const enc = encodeURIComponent

export function create(url) {

    let shallWeEmit = false
    let location = register(parse(url))
    intercept(location, mutation => {

        if (!shallWeEmit) {

            if (mutation.prop === 'href') {
                getObjectTarget(mutation.object).href = mutation.oldValue
                pushState(mutation.value)
                setHref(getWindowLocation())
            }


            else if (mutation.prop === 'pathname') {
                let href = mutation.value.split('/').map(enc).join('/')
                if (mutation.value[0]!=='/')
                    href = '/' + href
                href = href + location.search + location.hash
                getObjectTarget(mutation.object).pathname = mutation.oldValue
                pushState(href)
                setHref(getWindowLocation())
            }


            else if (mutation.prop === 'search') {
                let href = mutation.value[0]==='?' ? mutation.value.substr(1) : mutation.value
                href = href
                    .split('&')
                    .map(param=>{
                        let splited = param.split('=')
                        param = enc(splited[0]||'')
                        if (splited.hasOwnProperty(1))
                            param += '='+enc(splited[1]) 
                        return param
                    })
                    .join('&')

                href = location.pathname + '?' + href + location.hash
                getObjectTarget(mutation.object).search = mutation.oldValue
                pushState(href)
                setHref(getWindowLocation())
            }

            else if (mutation.prop === 'hash') {
                let href = mutation.value[0]==='#' ? mutation.value : '#' + mutation.value
                href = location.pathname + location.search + href
                getObjectTarget(mutation.object).hash = mutation.oldValue
                pushState(href)
                setHref(getWindowLocation())
            }

            else if (mutation.prop === 'path') {
                let href = '/'+mutation.value.map(enc).join('/') + location.search + location.hash
                pushState(href)
                setHref(getWindowLocation(), mutation)
            }

            else if (mutation.prop === 'query') {
                let href, prop, query=mutation.value, search=[]
                for (prop in query)
                    search.push(enc(prop)+'='+enc(query[prop]))
                
                href = location.pathname + '?'+search.join('&') + location.hash
                pushState(href)
                setHref(getWindowLocation())
            }

            // origin, protocol, domain
            else
                getObjectTarget(mutation.object)[mutation.prop] = mutation.oldValue

        }

        return shallWeEmit

    })


    intercept(location.path, mutation => {
        if (!shallWeEmit) {
            let path = location.path
            getObjectTarget(path)[mutation.prop] = enc(path[mutation.prop])
            let href = '/' + path.filter(p=>p!==undefined).join('/') + location.search + location.hash
            if ( href !== location.pathname ) {
                pushState(href)
                setHref(getWindowLocation(), mutation)
            }
        }
    })
    

    intercept(location.query, mutation => {
        if (!shallWeEmit) {
            let href, query=location.query, search=[], prop = mutation.prop
            // Is true if is not a delete
            if (mutation.hasOwnProperty('value')) {
                let propenc = enc(mutation.prop)
                let valueenc = enc(mutation.value)
                delete getObjectTarget(query)[mutation.prop]
                getObjectTarget(query)[propenc] = valueenc
            }
            for (prop in query)
                search.push(prop+'='+query[prop])
            href = location.pathname + '?'+search.join('&') + location.hash
            console.log( href );
            pushState(href)
            setHref(getWindowLocation(), mutation)
        }
    })

    
    function setHref(href, mutation) {
        let newlocation = parse(href)
        newlocation.href = getHref(newlocation)
        let collector = collect()
        if (mutation !== undefined)
            collector.mutations.push(mutation)
        shallWeEmit = true
        set(location, 'href', newlocation.href)
        set(location, 'pathname', newlocation.pathname)
        set(location, 'search', newlocation.search)
        set(location, 'hash', newlocation.hash)

        // path
        newlocation.path.forEach((path,index) => set(location.path, index, path))
        set(location.path, 'length', newlocation.path.length)

        // query
        let prop, newquery=newlocation.query, query=location.query
        for (prop in newquery)
            set(query, prop, newquery[prop])
        for (prop in query)
            if (!newquery.hasOwnProperty(prop))
                del(query, prop)

        // emit
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
        origin: match[1],
        protocol: match[2],
        host: match[3],
        pathname: match[4],
        path: match[4].split('/').filter(item => item.length>0),
        search: match[5],
        query: query,
        hash: match[6] || ''
    }
    location.href = getHref(location)



    if (location.search.length > 1) {
        location.search.substr(1).split('&').forEach(item => {
            if (item.length > 0) {
                let equal = item.indexOf('=');
                (equal > -1) ?
                    location.query[item.substr(0,equal)] = item.substr(equal+1)
                :
                    location.query[item] = ''
            }
        })
    }

    return location
}
