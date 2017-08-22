import QRious from 'qrious'

export function generateQRCode(value, size=300, foreground='black', background='white') {
    return new QRious({
        background: background,
        foreground: foreground,
        size: size,
        value: value,
        level: 'H'
    }).toDataURL()
}