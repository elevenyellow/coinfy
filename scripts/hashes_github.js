const fetch = require('node-fetch')

const domain = 'https://coinfy.com'
const respository = `https://api.github.com/repos/elevenyellow/coinfy/git/trees/master`

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
    function getOneFolder(parent) {
        return getFolder(parent.url).then(files => {
            files.forEach(file => {
                file.path = parent.path + file.path
                file.level = parent.level + 1
                if (file.type === 'tree') {
                    file.path = file.path + '/'
                    if (filter(file)) getOneFolder(file)
                }
                // save
                console.log(file.path, file.level)
            })
        })
    }

    // return new Promise((resolve, reject) => {
    getOneFolder({ url: url, path: '/', level: 0 })
    // })
}

getTree(respository, file => file.level > 1 || file.path === 'public')
