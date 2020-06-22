const querystring = require('querystring');

module.exports = (url) => {
    const tokens = url.split('/').filter((item) => item);
    const query = tokens[tokens.length - 1].split('?');
    let queryParams = {};
    if (query[1]) {
        queryParams = querystring.parse(query[1]);
    }
    const paths = tokens.slice(0, tokens.length - 1).concat(query[0]);
    return {
        paths,
        query: queryParams,
    };
};
