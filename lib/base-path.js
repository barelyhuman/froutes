const path = require('path')
const argv = require('minimist')(process.argv.slice(2))

let _basePath

module.exports = () => {
    if (!_basePath) {
        const dir = argv.d || argv.dir || 'api'
        _basePath = path.join(__dirname, dir)
    }
    return _basePath
}
