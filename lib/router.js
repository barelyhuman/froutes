const basePath = require('./base-path');
const path = require('path');
const parseUrl = require('./parse-url');

module.exports = async (availableRoutes, req, res) => {
    try {
        const parsedRouteUrl = parseUrl(req.url);
        let handlerPath = '';
        let currentPointer = availableRoutes;

        parsedRouteUrl.forEach((item) => {
            if (!currentPointer[item]) {
                currentPointer = null;
                return;
            }
            currentPointer = currentPointer[item];
            if (currentPointer) {
                if (currentPointer.type === 'file') {
                    handlerPath += currentPointer.index;
                } else if (currentPointer.type === 'dir') {
                    handlerPath += item + '/';
                }
            }
        });

        if (!currentPointer) {
            res.statusCode = 404;
            res.end();
            return;
        }

        if (currentPointer.type === 'dir') {
            handlerPath += currentPointer.index;
        }

        let _handlerPath = path.join(basePath(), handlerPath);

        const handler = require(_handlerPath);

        return handler(req, res);
    } catch (err) {
        console.error(err);
        res.statusCode(500);
        res.end();
        throw err;
    }
};
