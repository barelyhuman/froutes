const url = require('url')
const querystring = require('querystring')

module.exports = (urlstring) => {
    const _url = url.parse(urlstring)
    const paths = _url.pathname.split('/')
    let _paths = []

    for (let i = 0; i < paths.length; i += 1) {
        if (paths[i]) {
            _paths.push(paths[i])
        }
    }

    let queryParams = {}
    if (_url.search && _url.search.length > 0) {
        queryParams = querystring.parse(_url.search.replace('?', ''))
    }
    return {
        paths: _paths,
        query: queryParams,
    }
}
