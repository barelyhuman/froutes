const http = require('http')
const process = require('process')
const microServer = require('./micro-server.js')
const setupRoutes = require('./setup-routes.js')
const basePath = require('./base-path.js')

function serve() {
	const argv = require('minimist')(process.argv.slice(2))
	const port = argv.p || argv.port || 3000

	setupRoutes({
		basePath: basePath(),
	})
		.then((availableRoutes) => {
			http
				.createServer((request, response) => {
					microServer(request, response, availableRoutes)
				})
				.listen(port, () => {
					console.log('> Listening on ' + port)
				})
		})
		.catch((error) => {
			console.log(error)
			throw error
		})
}

exports.serve = serve
