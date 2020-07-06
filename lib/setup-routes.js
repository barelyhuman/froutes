const basePath = require('./base-path')
const path = require('path')
const processDirectories = require('./process-dirs')

module.exports = () => {
    const processingPath = path.join(basePath())
    return processDirectories(processingPath)
}
