import { getRandomArbitrary } from '/api/numbers'

export function generateRandomColor(min = 0, max = 255) {
    return rgbToHex({
        r: getRandomArbitrary(min, max),
        g: getRandomArbitrary(min, max),
        b: getRandomArbitrary(min, max)
    })
}

export function rgbToHex({ r, g, b }) {
    return (
        '#' +
        r.toString(16) +
        g.toString(16) +
        b.toString(16)
    ).toUpperCase()
}

// https://github.com/matkl/average-color
export function getAverageColor(img) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const width = (canvas.width = img.naturalWidth)
    const height = (canvas.height = img.naturalHeight)

    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    let l = data.length
    let i = 0
    let r = 0
    let g = 0
    let b = 0
    let pixels = 0

    for (; i < l; i += 4) {
        if (data[i + 3] > 0) {
            pixels += 1
            r += data[i]
            g += data[i + 1]
            b += data[i + 2]
        }
    }

    r = Math.floor(r / pixels)
    g = Math.floor(g / pixels)
    b = Math.floor(b / pixels)

    return { r: r, g: g, b: b }
}
