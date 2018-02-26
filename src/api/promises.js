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
