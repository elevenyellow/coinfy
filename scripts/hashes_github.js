const fetch = require('node-fetch')
const crypto = require('crypto')
const colors = require('colors')
const bytes = require('utf8-bytes')

const domain = 'https://coinfy.com'
const respository = `https://api.github.com/repos/elevenyellow/coinfy/git/trees/master`
const extensions = ['js', 'htm', 'html', 'css']

// Getting email
const email = process.argv[2]
const password = process.argv[3]
const timeout_repeat = process.argv[4] | 1
let repeat = false

// Getting parameters
if (typeof email == 'string') {
    if (validateEmail(email)) {
        if (typeof password == 'string') {
            repeat = true
        } else {
            console.log('Type a password as second parameter')
            process.exit()
        }
    } else {
        console.log('Invalid email')
        process.exit()
    }
}

console.log('Getting tree list...')
getTree(respository, file => file.path.indexOf('public') > -1).then(list => {
    checkFiles(list)
})

function checkFiles(list) {
    console.log('Checking list: ' + new Date().toString())
    let completed = 0
    let incorrect = []
    list = list.filter(item => extensions.includes(getExtension(item.path)))
    list.forEach(item => {
        const path = domain + item.path.replace('public', '')
        getFile(path).then(body => {
            completed += 1
            const hash_github = item.sha
            const hash_domain = shagit(body)
            if (hash_domain === hash_github) {
                console.log(colors.green(`✔ ${hash_github} `) + path)
            } else {
                incorrect.push(path)
                console.log(
                    colors.red(`✘ ${hash_domain}`) +
                        ` ${path}\n  ` +
                        colors.red(hash_github)
                )
            }

            if (completed === list.length) {
                const total_incorrects = incorrect.length
                const total_list = list.length
                console.log('')
                console.log(
                    colors[total_incorrects === 0 ? 'green' : 'red'].bold(
                        `  ${total_list - total_incorrects}/${total_list}`
                    )
                )

                if (repeat) {
                    if (total_incorrects > 0) {
                        console.log('Sending email')
                    }

                    setTimeout(() => {
                        checkFiles(list)
                    }, timeout_repeat * 60 * 1000)
                }

                console.log('')
            }
        })
    })
}

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

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}

// prompt('Whats your name?', function (input) {
//     console.log(input);
//     process.exit();
// });
// function prompt(question, callback) {
//     const stdin = process.stdin,
//         stdout = process.stdout

//     stdin.resume()
//     stdout.write(question)

//     stdin.once('data', data => {
//         callback(data.toString().trim())
//     })
// }
