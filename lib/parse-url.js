const url = require('url');
const querystring = require('querystring');

module.exports = (urlstring) => {
    const _url = url.parse(urlstring);
    const paths = _url.pathname.split('/').filter((item) => item);
    let queryParams = {};
    if (_url.search && _url.search.length > 0) {
        queryParams = querystring.parse(_url.search.replace('?', ''));
    }
    return {
        paths,
        query: queryParams,
    };
};
