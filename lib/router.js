export const findRoute = async (manifest, request, response) => {
	const [urlPath, queryString] = request.url.split('?')

	const _path = urlPath.replace(/\/$/, '') + '/index.js'

	let handler = () => response.end()

	for (const item of Object.values(manifest)) {
		if (!(item && item.pattern)) {
			continue
		}

		if (!item.pattern.test(_path)) {
			continue
		}

		// Match any
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

	const {hasQueryParams, query} = parseQueryParameters(queryString)

	if (hasQueryParams) {
		request.query = query
	}

	return handler(request, response)
}

const parseQueryParameters = (queryString = '') => {
	const result = {
		hasQueryParams: false,
	}
	if (String(queryString).trim().length === 0) {
		return result
	}

	result.hasQueryParams = true
	result.query = {}

	const _sp = new URLSearchParams(queryString)
	for (const key of _sp.keys()) {
		result.query[key] = _sp.get(key)
	}

	return result
}
