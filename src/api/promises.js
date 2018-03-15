// advanced fetch with timeout
export function fetchTimeout(url, options = {}) {
    let resolve, reject, timeout

    if (typeof options.timeout == 'number') {
        timeout = setTimeout(() => {
            reject('timeout')
        }, options.timeout)
    }

    return new Promise((res, rej) => {
        resolve = value => {
            clearTimeout(timeout)
            res(value)
        }
        reject = reason => {
            clearTimeout(timeout)
            rej(reason)
        }

        fetch(url, options)
            .then(resolve)
            .catch(reject)
    })
}

export function resolveAll(promises) {
    const values = []
    let resolve
    let total = promises.length
    const onResolveReject = () => {
        if (--total === 0) resolve(values)
    }
    promises.forEach(promise =>
        promise
            .then(value => {
                values.push(value)
                onResolveReject()
            })
            .catch(onResolveReject)
    )
    return new Promise(r => (resolve = r))
}

export function repeatUntilResolve(promise, args, props = { timeout: 5000 }) {
    let resolve
    const { timeout, onReject } = props
    const P = new Promise(res => {
        resolve = res
    })
    const reject = e => {
        if (typeof onReject == 'function') onReject(e)
        else
            console.error(`${promise.name}: "${e}" (repeating in ${timeout}ms)`)
        setTimeout(() => {
            promise
                .apply(promise, args)
                .then(resolve)
                .catch(reject)
        }, timeout)
    }

    promise
        .apply(promise, args)
        .then(resolve)
        .catch(reject)
    return P
}

// fetch with delay for testing
export function fetchDelay(url, delay) {
    if (typeof delay !== 'number') delay = 1000
    return new Promise(resolve => {
        setTimeout(() => {
            fetch(url).then(resolve)
        }, delay)
    })
}

export function fetchAny(urls) {
    const errors = []
    let response, reject
    let index = 0
    const fetchLoop = url => {
        fetch(url)
            .then(r => response(r))
            .catch(e => {
                errors.push(e)
                if (index < urls.length - 1) fetchLoop(urls[++index])
                else reject(e)
            })
    }
    fetchLoop(urls[index])
    return new Promise((res, rej) => {
        response = res
        reject = rej
    })
}
