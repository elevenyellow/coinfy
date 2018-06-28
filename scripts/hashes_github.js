// const request = require('request')
const fetch = require('node-fetch')
const crypto = require('crypto')
const colors = require('colors')
const request = require('request')
const bytes = require('utf8-bytes')

const domain = 'http://localhost:8000' //'https://coinfy.com'
const respository = `https://api.github.com/repos/elevenyellow/coinfy/git/trees/master`
const extensions = ['js', 'htm', 'html', 'css']

console.log('Getting tree list...')
getTree(respository, file => file.path.indexOf('public') > -1).then(list => {
    console.log('✔ Tree list received')

    let correct = 0
    list = list.filter(item => extensions.includes(getExtension(item.path)))
    list.forEach(item => {
        const path = domain + item.path.replace('public', '')
        getFile(path).then(body => {
            // console.log(body.length, path)
            const hash_github = item.sha
            const hash_domain = shagit(body)
            if (hash_domain === hash_github) {
                correct += 1
                console.log(colors.green(`✔ ${hash_github} `) + path)
            } else
                console.log(
                    colors.red(`✘ ${hash_domain}`) +
                        ` ${path}\n  ` +
                        colors.red(hash_github)
                )
        })
    })
})

// UTILS FUNCTIONS

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
    const total_bytes = bytes(data).length
    return sha1(`blob ${total_bytes}\0${data}`)
}

function getFolder(url) {
    const files = []
    return fetch(url)
        .then(response => response.json())
        .then(json => {
            if (Array.isArray(json.tree)) {
                json.tree.forEach(item => {
                    files.push({
                        path: item.path,
                        type: item.type,
                        url: item.url,
                        sha: item.sha
                    })
                })
                return files
            } else console.error(json)
        })
}

function getTree(url, filter) {
    const list = []

    function getOneFolder(parent) {
        return getFolder(parent.url).then(files => {
            files.forEach(file => {
                file.path = parent.path + file.path
                file.level = parent.level + 1
                if (file.type === 'tree') file.path = file.path + '/'
                list.push(file)
                // console.log(file.level, file.path)
            })
            goDeep()
        })
    }

    function goDeep() {
        for (let i = 0; i < list.length; ++i) {
            const file = list[i]
            if (file.type === 'tree') {
                list.splice(i--, 1)
                if (filter(file)) {
                    getOneFolder(file)
                    return
                }
            }
        }
        resolve(list)
    }

    let resolve, reject
    return new Promise((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
        getOneFolder({ url: url, path: '', level: 0 })
    })
}

function getExtension(path) {
    const split = path.split('.')
    return split[split.length - 1]
}
