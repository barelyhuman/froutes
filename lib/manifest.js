import {existsSync} from 'node:fs'
import {resolve, join} from 'node:path'
import {parse} from 'regexparam'
import {deepReadDir} from './directories.js'
import {log} from './log.js'

export const generateManifest = async () => {
	try {
		const manifest = {}
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
