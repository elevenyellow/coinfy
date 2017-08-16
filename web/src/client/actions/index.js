import { set } from 'dop'
import { location } from '/stores/router'
import state from '/stores/state'


export function setHref(href) {
    set(location, 'href', href)
}