const parseUrl = require('./parse-url.js')
const {send, status} = require('./request-helpers.js')

module.exports = async (availableRoutes, request, response) => {
	try {
		const parsedRouteUrl = parseUrl(request.url)
		response.send = send(response)
		response.status = status(response)
		request.query = parsedRouteUrl.query

		let pathName = parsedRouteUrl.url.pathname

		if (pathName[pathName.length - 1] === '/') {
			pathName = pathName.slice(0, -1)
		}

		if (Object.prototype.hasOwnProperty.call(availableRoutes, pathName)) {
			return availableRoutes[pathName].handler(request, response)
		}

		let match = false
		for (const k in availableRoutes) {
			if (!availableRoutes[k].parser.parse.test(pathName)) {
				continue
			}

			if (typeof availableRoutes[k].handler !== 'function') {
				continue
			}

			match = true
			request.params = availableRoutes[k].parser.getParam(pathName)
			availableRoutes[k].handler(request, response)
			break
		}

		if (!match) {
			response.status(404)
			return response.end()
		}
	} catch (error) {
		console.error(error)
		response.status(500)
		response.end()
		throw error
	}
}
