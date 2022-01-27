#!/usr/bin/env node
const process = require('process')
const microServer = require('./lib/micro-server.js')
const setupRoutes = require('./lib/setup-routes.js')
const warn = require('./lib/warn.js')

const initProject = require('./lib/init-project.js')
const {serve} = require('./lib/serve.js')

function main() {
	const argv = require('minimist')(process.argv.slice(2))
	if (process.argv[1].includes('routex')) {
		warn(
			'routex has been renamed/replaced by ftrouter, You can fix it by renaming your executables to ftrouter.'
		)
	}

	if (argv.init) {
		return initProject()
	}

	return serve()
}

process.on('uncaughtException', (error) => {
	throw error
})

process.on('unhandledRejection', (error) => {
	throw error
})

function expose() {
	return (config) => {
		return setupRoutes(config).then((availableRoutes) => {
			const handler = (request, response) =>
				microServer(request, response, availableRoutes)
			return handler
		})
	}
}

if (require.main === module) {
	main()
} else {
	module.exports = expose()
}
