import { register } from 'dop'
import { getRoute } from '/router'

const ui = register({
    url: getRoute(window.location.href)
})

export default ui