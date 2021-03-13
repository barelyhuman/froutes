const createAvailableRoutes = require('./create-available-routes')
const ora = require('ora')

module.exports = async (directory) => {
    const spinner = ora('Compiling...').start()
    try {
        const availableRoutesTree = await createAvailableRoutes(directory)
        spinner.succeed('Compiled')
        return availableRoutesTree
    } catch (err) {
        spinner.color = 'red'
        spinner.text = 'Failed'
        spinner.fail()
        throw err
    }
}
