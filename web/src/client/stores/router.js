import { create } from '/doprouter'

const location = create(window.location.href)
const routes = {
    home: '/',
    addwallet: '/addwallet'
}

export { location, routes }