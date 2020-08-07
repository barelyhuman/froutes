const processDirectories = require('./process-dirs')
const { createCompilationDirectory } = require('./create-compilation-dir')

module.exports = (config) => {
    createCompilationDirectory()
    return processDirectories(config.basePath)
}
