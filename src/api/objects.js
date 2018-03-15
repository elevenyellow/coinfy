export function jsonParse(mixed, f) {
    let json
    try {
        json = JSON.parse(mixed, f)
    } catch (e) {}
    return json !== null && typeof json == 'object' ? json : {}
}

// convert all the keys in lowercase
export function keysToLowerCase(json) {
    return JSON.parse(
        json,
        (function() {
            let last
            return function(key, value) {
                if (last !== undefined) delete last.obj[last.key]
                const keylower = key.toLowerCase()
                // console.log(typeof value, key.length)
                if (key.length > 0 && !this.hasOwnProperty(keylower)) {
                    this[keylower] = value
                    last = { obj: this, key: key }
                }
                return value
            }
        })()
    )
}
