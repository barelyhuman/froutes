const url = require('url')
const querystring = require('querystring')

module.exports = (urlstring) => {
	const _url = new url.URL(urlstring)
	const paths = _url.pathname.split('/')
	const _paths = []

	for (const path of paths) {
		if (path) {
			_paths.push(path)
		}
	}

	let queryParameters = {}
	if (_url.search && _url.search.length > 0) {
		queryParameters = querystring.parse(_url.search.replace('?', ''))
	}

	return {
		url: _url,
		paths: _paths,
		query: queryParameters,
	}
}
