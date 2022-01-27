// Read the configured directory
// create a manifest (definition of routes kinda thing)
// create route handlers for each with the given functions
// bundle the entire into a single file (not in dev mode)

import {existsSync} from 'node:fs'
import {readdir} from 'node:fs/promises'
import {resolve, join} from 'node:path'
import http from 'node:http'
import {parse} from 'regexparam'
import {log} from './lib/log.js'

const manifest = {}

const handleRoutes = async (manifest, request, response) => {
	const urlPath = request.url

	const _path = urlPath.replace(/\/$/, '') + '/index.js'

	let handler = () => response.end()

	for (const item of Object.values(manifest)) {
		if (!(item && item.pattern)) {
			continue
		}

		if (!item.pattern.test(_path)) {
			continue
		}

		if (item.keys.length > 0) {
			const parameters = {}
			const matches = item.pattern.exec(_path)

			for (let i = 0; i < item.keys.length; i++) {
				parameters[item.keys[i]] = matches[i + 1]
			}

			request.params = parameters
		}

		handler = item.handler
		break
	}

	return handler(request, response)
}

const generateManifest = async () => {
	try {
		if (!existsSync('./routes')) {
			log.error("the directory, `api` doesn't exist")
			return
		}

		const rootPath = resolve('.')
		const routesPath = join(rootPath, 'routes')
		const allFiles = await deepReadDir(routesPath)

		await Promise.all(
			allFiles.map(async (filePath) => {
				// eslint-disable-next-line node/no-unsupported-features/es-syntax
				const mod = await import(filePath)
				if (!mod.default) {
					throw new Error(
						`Route handlers need to export a default function: ${filePath}`
					)
				}

				const cleanedPath = filePath
					.replace(routesPath, '')
					.replace(/\[(\w+)]/g, ':$1')

				const {keys, pattern} = parse(cleanedPath, true)

				manifest[cleanedPath] = {
					keys,
					pattern,
					handler: mod.default,
				}
			})
		)
		return manifest
	} catch (error) {
		log.error(error.message)
	}
}

export const deepReadDir = async (dir) => {
	const dirents = await readdir(dir, {withFileTypes: true})
	const files = await Promise.all(
		dirents.map((dirent) => {
			const response = resolve(dir, dirent.name)
			return dirent.isDirectory() ? deepReadDir(response) : response
		})
	)
	return files.flat()
}

const froutes = async () => {
	const manifest = await generateManifest()

	http
		.createServer(function (request, response) {
			handleRoutes(manifest, request, response)
		})
		.listen(3000, () => {
			log.info('>> Listening on 3000')
		})
}

export default froutes
