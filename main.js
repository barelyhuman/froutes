import http from 'node:http'
import {log} from './lib/log.js'
import {generateManifest} from './lib/manifest.js'
import {findRoute} from './lib/router.js'

const froutes = async () => {
	const manifest = await generateManifest()

	http
		.createServer(function (request, response) {
			findRoute(manifest, request, response)
		})
		.listen(3000, () => {
			log.info('>> Listening on 3000')
		})
}

export default froutes
