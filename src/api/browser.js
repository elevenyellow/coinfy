// import { supplant } from '/api/strings'
import { MAINNET } from '/const/'

export function printTemplate(template, data = {}, printIn = 1000) {
    const html = template //supplant(template, data)
    const win = window.open('about:blank', '_blank')
    win.document.write(html)
    setTimeout(() => {
        win.print()
    }, printIn)
}

export function openUrl(url) {
    return window.open(url)
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

export function localStorageSet(key, value, network = MAINNET) {
    key = network === MAINNET ? key : `${key}-${network}`
    return window.localStorage.setItem(key, value)
}
export function localStorageGet(key, network = MAINNET) {
    key = network === MAINNET ? key : `${key}-${network}`
    return window.localStorage.getItem(key)
}
export function localStorageRemove(key, network = MAINNET) {
    key = network === MAINNET ? key : `${key}-${network}`
    return window.localStorage.removeItem(key)
}

export function openFile(onOpen) {
    const input = createInputFile()
    input.addEventListener('change', e => forEachFile(input).forEach(onOpen))
    input.click()
}

export function createInputFile() {
    const input = document.createElement('input')
    input.type = 'file'
    input.style.display = 'none'
    document.body.insertBefore(input, document.body.childNodes[0])
    const eventListener = e => {
        input.removeEventListener('change', eventListener)
        input.parentNode.removeChild(input)
    }
    input.addEventListener('change', eventListener)
    return input
}

export function forEachFile(input, onOpen) {
    const files = []
    for (let index in input.files) {
        const file = input.files[index]
        if (file !== null && typeof file === 'object') files.push(file)
    }
    return files
}

export function readFile(file, onRead) {
    // if ( file.type.indexOf('json') > -1 || file.type.indexOf('text') > -1 || file.type==='' ) {
    const reader = new FileReader()
    reader.onload = e => onRead(e.target.result)
    reader.readAsText(file)
}

export function downloadFile({ data, name, a, filetype = 'charset=UTF-8' }) {
    const is_a_undefined = a === undefined
    const a_created = is_a_undefined ? document.createElement('a') : a
    const file = new Blob([data], { type: filetype }) //,
    // const date = new Date().toJSON().replace(/\..+$/,'')
    a_created.href = URL.createObjectURL(file)
    a_created.download = name
    if (is_a_undefined) a_created.click()
}

export function addOriginUrl(path) {
    if (path[0] !== '/') path = '/' + path
    return location.origin + path
}

export function locationHref(path) {
    if (typeof path == 'string') window.location.href = path
    return window.location.href
}
