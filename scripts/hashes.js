const recursive = require('recursive-readdir')
const crypto = require('crypto')
const fs = require('fs')
const request = require('request')
const colors = require('colors')
const domain = 'https://coinfy.com'

function readLocalFile(path) {
    return fs.readFileSync(path, 'utf8')
}

function sha1(data) {
    const shasum = crypto.createHash('sha1')
    shasum.update(data)
    return shasum.digest('hex')
}

function shagit(data) {
    return sha1(`blob ${data.length + 1}\0${data}\n`)
}

recursive('./public', ['.*'], (err, paths) => {
    console.log('')
    let correct = 0
    let loaded = 0
    const total_paths = paths.length

    paths.forEach(path => {
        const path_clean = path.replace('public', '')
        const url = `https://coinfy.com${path_clean}`
        // console.log(shagit(readLocalFile(path)), path)
        request(url, (error, response, body) => {
            loaded += 1
            const hash_remote = shagit(body)
            const hash_local = shagit(readLocalFile(path))
            if (hash_remote === hash_local) {
                correct += 1
                console.log(colors.green(`✔ ${hash_local} `) + path)
            } else
                console.log(
                    colors.red(`✘ ${hash_local}`) +
                        ` ${path}\n  ` +
                        colors.red(hash_remote) +
                        ` ${url}`
                )

            if (loaded === total_paths) {
                console.log('')
                console.log(
                    colors[correct === total_paths ? 'green' : 'red'].bold(
                        `  ${correct}/${total_paths}`
                    )
                )
                console.log('')
            }
        })
    })
})
