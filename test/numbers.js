// https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4
import test from 'tape'
import { bigNumber, decimals } from '/api/numbers'

test('bigNumber.toString', t => {
    function allTypes(t, f, result, value) {
        t.equal(f(value).toString(), result, `${f.name} ${value}`)
        // t.equal(
        //     f(Number(value)).toString(),
        //     result,
        //     `Number(${f.name}) ${value}`
        // )
        t.equal(
            f(String(value)).toString(),
            result,
            `String(${f.name}) ${value}`
        )
        t.equal(
            f(bigNumber(value)).toString(),
            result,
            `bigNumber(${f.name}) ${value}`
        )
    }

    // allTypes(t, bigNumber, '12345678901234567890', 12345678901234567890)

    allTypes(t, bigNumber, '0', 0)
    allTypes(t, bigNumber, '0', 0.0)
    allTypes(t, bigNumber, '1', 1.0)
    allTypes(t, bigNumber, '1.01', 1.01)
    allTypes(
        t,
        bigNumber,
        '0.12345678012345679',
        0.1234567801234567890123456789
    )
    allTypes(
        t,
        bigNumber,
        '0.1234567801234567890123456789',
        '0.1234567801234567890123456789'
    )

    t.end()
})

test('bigNumber.toFixed', t => {
    t.equal(bigNumber(0).toFixed(), '0')
    // t.equal(bigNumber(0).toFixed(1), '0.0')
    // t.equal(bigNumber(0).toFixed(21), '0.000000000000000000000')

    t.end()
})

test('decimals', t => {
    function allTypes(t, f, result, value, value2) {
        t.equal(f(value, value2), result, `${f.name} ${value}`)
        t.equal(f(Number(value), value2), result, `Number(${f.name}) ${value}`)
        t.equal(f(String(value), value2), result, `String(${f.name}) ${value}`)
        t.equal(
            f(bigNumber(value), value2),
            result,
            `bigNumber(${f.name}) ${value}`
        )
    }

    allTypes(t, decimals, '1.00', 1)
    allTypes(t, decimals, '1.00', '1')
    allTypes(t, decimals, '1.00', bigNumber(1))
    allTypes(t, decimals, '1.00', bigNumber('1'))

    allTypes(t, decimals, '0.00', 0)
    allTypes(t, decimals, '0.00', '0')
    allTypes(t, decimals, '0.00', bigNumber(0))
    allTypes(t, decimals, '0.00', bigNumber('0'))

    allTypes(t, decimals, '0.12', 0.1234567801234567890123456789)
    allTypes(t, decimals, '0.12', '0.12345678012345678901234567890')
    allTypes(t, decimals, '0.12', bigNumber(0.1234567801234567890123456789))
    allTypes(t, decimals, '0.12', bigNumber('0.12345678012345678901234567890'))

    allTypes(
        t,
        decimals,
        '0.12345678012345678853',
        0.1234567801234567890123456789,
        20
    )
    allTypes(
        t,
        decimals,
        '0.12345678012345678853',
        '0.12345678012345678901234567890',
        20
    )
    allTypes(
        t,
        decimals,
        '0.12345678012345678853',
        bigNumber(0.1234567801234567890123456789),
        20
    )
    allTypes(
        t,
        decimals,
        '0.12345678012345678853',
        bigNumber('0.12345678012345678901234567890'),
        20
    )

    t.end()
})
