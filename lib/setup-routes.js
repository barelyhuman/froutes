const processDirectories = require('./process-dirs')

module.exports = (config) => {
    return processDirectories(config.basePath)
}
