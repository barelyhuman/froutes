const basePath = require('./base-path')
const fs = require('fs').promises
const path = require('path')
const checkApiDir = require('./check-api-dir')
const processDirectories = require('./process-dirs')

module.exports = () => {
    return fs
        .readdir(basePath())
        .then((dirs) => {
            // const apiDirExists = checkApiDir(dirs);
            // if (!apiDirExists.valid) {
            //     throw new Error('cannot find an `api` directory');
            // }
            const processingPath = path.join(basePath())
            return processDirectories(processingPath)
        })
        .catch((err) => {
            console.error(err)
            throw err
        })
}
