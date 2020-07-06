const path = require('path')
const argv = require('minimist')(process.argv.slice(2))

const dir = argv.d || argv.dir || 'api'
const basePath = path.join(process.cwd(), dir)

module.exports = () => {
    return basePath
}
