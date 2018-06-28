// const request = require('request')
const fetch = require('node-fetch')
const crypto = require('crypto')
const { exec, execSync } = require('child_process')

const file = '/static/css/index.css'
const infogithub =
    'https://api.github.com/repos/elevenyellow/coinfy/contents/public'
const localhost = 'http://localhost:8000' //'https://coinfy.com'
const coinfy = 'https://coinfy.com'
const github =
    'https://raw.githubusercontent.com/elevenyellow/coinfy/master/public'
const localpath = '/Users/enzo/Copy/projects/elevenyellow/coinfy/public'

exec(`cat ${localpath + file} | git hash-object -w --stdin`, (err, stdout) => {
    show(stdout.trim(), 'exec cat')
})

fetch(infogithub + file)
    .then(response => response.json())
    .then(data => {
        show(data.sha, 'GITHUB!!')
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
    // shasum.update(new Buffer(data, 'utf8'))
    return shasum.digest('hex')
}

// https://stackoverflow.com/questions/552659/how-to-assign-a-git-sha1s-to-a-file-without-git/552725#552725
function shagit(data) {
    return sha1(`blob ${data.length}\0${data}`)
}
