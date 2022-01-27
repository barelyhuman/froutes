const processDirectories = require('./process-dirs.js')

module.exports = (config) => {
	return processDirectories(config.basePath)
}
