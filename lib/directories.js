import {readdir} from 'node:fs/promises'
import {resolve} from 'node:path'

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
