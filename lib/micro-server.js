const router = require('./router.js')

module.exports = async (request, response, availableRoutes) => {
	try {
		return router(availableRoutes, request, response)
	} catch (error) {
		console.error(error)
		throw error
	}
}
