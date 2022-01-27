const fs = require('fs')
const path = require('path')
const basePath = require('./base-path.js')

module.exports = async () => {
	try {
		const creationPath = path.join(basePath(), '.route')
		const exists = await new Promise((resolve) => {
			fs.stat(creationPath, (error) => {
				if (
					(error && error.code === 'ENOENT') ||
					(error && error.code === 'ENOTDIR')
				) {
					resolve(false)
				}

				return resolve(true)
			})
		})

		if (exists) {
			return creationPath
		}

		await new Promise((resolve, reject) => {
			fs.mkdir(creationPath, (error, done) => {
				if (error) reject(error)
				resolve(done)
			})
		})

		return creationPath
	} catch (error) {
		console.error(error)
		throw error
	}
}
