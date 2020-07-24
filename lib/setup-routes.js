const processDirectories = require('./process-dirs')

module.exports = (config) => {
    console.log({ config })
    return processDirectories(config.basePath)
}
