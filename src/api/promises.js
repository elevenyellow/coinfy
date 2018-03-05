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
