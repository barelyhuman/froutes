const fs = require('fs')
const path = require('path')

const compilationDirectory = path.join(process.env.PWD, '.ftrouter')

exports.compilationDirectory = compilationDirectory

exports.createCompilationDirectory = async () => {
    try {
        const creationPath = compilationDirectory
        const exists = await new Promise((resolve, reject) => {
            fs.stat(creationPath, (err, stat) => {
                if (
                    (err && err.code === 'ENOENT') ||
                    (err && err.code === 'ENOTDIR')
                ) {
                    resolve(false)
                }
                return resolve(true)
            })
        })

        if (exists) {
            return creationPath
        } else {
            await new Promise((resolve, reject) => {
                fs.mkdir(creationPath, (err, done) => {
                    if (err) reject(err)
                    resolve(done)
                })
            })
        }

        return creationPath
    } catch (err) {
        console.error(err)
        throw err
    }
}
