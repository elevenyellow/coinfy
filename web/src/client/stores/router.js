import { create } from '/doprouter/core'

const location = create(window.location.href)
const routes = {
    home: '/',
    addwallet: '/addwallet',
    createbtc: '/addwallet/create-bitcoin',
    importbtc: '/addwallet/import-bitcoin',
}

export { location, routes }