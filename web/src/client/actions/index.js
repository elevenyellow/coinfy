import { set } from 'dop'
import { location } from '/stores/router'

export function setHref(href) {
    set(location, 'href', href)
}