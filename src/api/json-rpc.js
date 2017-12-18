export default function JSONRpc(url, method, params, id = Math.random()) {
    const body = {
        method: method,
        id: String(id),
        jsonrpc: '2.0'
    }

    if (Array.isArray(params)) body.params = params

    const fetchOptions = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            //     Accept: 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
            //     'Access-Control-Allow-Origin': '*'
        }
    }

    return fetch(url, fetchOptions)
}
