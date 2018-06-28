// const request = require('request')
const fetch = require('node-fetch')
const crypto = require('crypto')
const { exec, execSync } = require('child_process')

const file = '/static/bundle/main.js'
const infogithub =
    'https://api.github.com/repos/elevenyellow/coinfy/contents/public'
const localhost = 'http://localhost:8000' //'https://coinfy.com'
const coinfy = 'https://coinfy.com'
const github =
    'https://raw.githubusercontent.com/elevenyellow/coinfy/master/public'
const localpath = '/Users/enzo/Copy/projects/elevenyellow/coinfy/public'

fetch(infogithub + file)
    .then(response => response.json())
    .then(data => {
        show(data.sha, 'GITHUB!!')
    })

exec(`cat ${localpath + file} | git hash-object -w --stdin`, (err, stdout) => {
    show(stdout.trim(), 'exec cat')
})

remote(localhost + file)
remote(coinfy + file)
remote(github + file)

function remote(_url) {
    const domain = /\/\/([^/]+)\//gm.exec(_url)
    getFile(_url).then(file => {
        showInfo(file, 'getFile ' + domain[1])
    })
    exec(`curl ${_url} | git hash-object -w --stdin`, (err, stdout) => {
        show(stdout.trim(), 'exec curl ' + domain[1])
    })
}

// UTILS FUNCTIONS
function show(sha, type) {
    console.log(sha, type)
}

function showInfo(data, type) {
    show(shagit(data), type)
}

function getFile(url) {
    return fetch(url)
        .then(response => response.text())
        .then(body => body)
}

function sha1(data) {
    const shasum = crypto.createHash('sha1')
    shasum.update(data)
    return shasum.digest('hex')
}

// https://stackoverflow.com/questions/552659/how-to-assign-a-git-sha1s-to-a-file-without-git/552725#552725
function shagit(data) {
    const total = toUTF8Array(data)
    return sha1(`blob ${total.length}\0${data}`)
}

function toUTF8Array(str) {
    var utf8 = []
    for (var i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i)
        if (charcode < 0x80) utf8.push(charcode)
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f))
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(
                0xe0 | (charcode >> 12),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f)
            )
        }
        // surrogate pair
        else {
            i++
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode =
                0x10000 +
                (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff))
            utf8.push(
                0xf0 | (charcode >> 18),
                0x80 | ((charcode >> 12) & 0x3f),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f)
            )
        }
    }
    return utf8
}
