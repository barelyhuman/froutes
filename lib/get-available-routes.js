const fs = require('fs')
const path = require('path')
const {Buffer} = require('buffer')
const createRouteDir = require('./create-route-dir.js')

module.exports = async () => {
	try {
		const routeDir = await createRouteDir()

		return new Promise((resolve, reject) => {
			fs.readFile(path.join(routeDir, 'routes.json'), (error, data) => {
				if (error) reject(error)
				resolve(JSON.parse(Buffer.from(data).toString()))
			})
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
