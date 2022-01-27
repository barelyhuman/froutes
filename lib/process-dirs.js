const ora = require('ora')
const createAvailableRoutes = require('./create-available-routes.js')

module.exports = async (directory) => {
	const spinner = ora('Compiling...').start()
	try {
		const availableRoutesTree = await createAvailableRoutes(directory)
		spinner.succeed('Compiled')
		return availableRoutesTree
	} catch (error) {
		spinner.color = 'red'
		spinner.text = 'Failed'
		spinner.fail()
		throw error
	}
}
