export function now() {
    return Math.round(Date.now() / 1000)
}

export function getDay(timestamp, miliseconds) {
    return getObjectDateCalculated(timestamp, miliseconds).getDate()
}

export function getMonth(timestamp, miliseconds) {
    return getObjectDateCalculated(timestamp, miliseconds).getMonth() + 1
}

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]
export function getMonthText(timestamp, miliseconds) {
    return monthNames[getMonth(timestamp, miliseconds) - 1]
}

export function getMonthTextShort(timestamp, miliseconds) {
    return getMonthText(timestamp, miliseconds).substr(0, 3)
}

function getObjectDateCalculated(timestamp, miliseconds = false) {
    return new Date(timestamp * (miliseconds ? 1 : 1000))
}
