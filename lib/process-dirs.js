const ora = require('ora')
const path = require('path')

const createAvailableRoutes = require('./create-available-routes')
const compileSourceFiles = require('./compile-source-files')
const { compilationDirectory } = require('./create-compilation-dir')

module.exports = async (directory) => {
    const spinner = ora('Compiling...').start()
    try {
        await compileSourceFiles(directory)
        const routesDirectory = path.join(compilationDirectory, 'routes')
        const availableRoutesTree = await createAvailableRoutes(routesDirectory)
        spinner.succeed('Compiled')
        return availableRoutesTree
    } catch (err) {
        spinner.color = 'red'
        spinner.text = 'Failed'
        spinner.fail()
        console.error(err)
        throw err
    }
}
