import { create, pushState } from '/doprouter'

const location = create(window.location.href)
const routes = {}

export { location, routes, pushState }