export default function JSONRpc(url, method, params = [], id = Math.random()) {
    const fetchOptions = {
        method: 'POST',
        headers: {
            //     Accept: 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
            //     'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            method: method,
            params: params,
            id: id,
            jsonrpc: '2.0'
        })
    }
    return fetch(url, fetchOptions)
}
