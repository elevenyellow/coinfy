import { supplant } from '/api/strings'

export function printTemplate(template, data) {
    const html = supplant(template, data)
    const win = window.open("about:blank", "_blank")
    win.document.write(html)
    setTimeout(()=>{ win.print() }, 2000)
}