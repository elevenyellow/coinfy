import { register, set } from 'dop'
import router from '/router'

const ui = register({
    url: window.location.href
})

router.onUpdate = function(url, urlparsed) {
    set(ui,'url',url)
}

export default ui