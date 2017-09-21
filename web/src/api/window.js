import { supplant } from '/api/strings'

export function printTemplate(template, data) {
    const html = supplant(template, data)
    const win = window.open("about:blank", "_blank")
    win.document.write(html)
    setTimeout(()=>{ win.print() }, 2000)
}

export function openUrl(url) {
    window.open(url)
}

export function selectContentElement(element) {
    if (document.selection) {
        const range = document.body.createTextRange()
        range.moveToElementText(element)
        range.select()
    } else if (window.getSelection) {
        const range = document.createRange()
        range.selectNodeContents(element)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
    }
}


export function copyContentSelected() {
    document.execCommand('copy')
}


export function localStorageSet(key, value) {
    return window.localStorage.setItem(key, value)
}
export function localStorageGet(key) {
    return window.localStorage.getItem(key)
}
export function localStorageRemove(key) {
    return window.localStorage.removeItem(key)
}