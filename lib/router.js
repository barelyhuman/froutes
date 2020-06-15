const basePath = require('./base-path');
const path = require('path');
const parseUrl = require('./parse-url');

module.exports = async (availableRoutes, req, res) => {
    try {
        const parsedRouteUrl = parseUrl(req.url);
        let handlerPath = '';
        let currentPointer = availableRoutes;

        parsedRouteUrl.forEach((item) => {
            let matchingKey;
            if (!currentPointer[item]) {
                matchingKey = Object.keys(currentPointer).find(
                    (key) =>
                        currentPointer[key].params &&
                        currentPointer[key].params.length > 0
                );

                if (matchingKey) {
                    currentPointer = currentPointer[matchingKey];
                    const key = matchingKey.replace(/[\[\]]/g, '');
                    req.params = {
                        [key]: item,
                    };
                } else {
                    currentPointer = null;
                    return;
                }
            } else {
                currentPointer = currentPointer[item];
            }

            if (currentPointer) {
                if (currentPointer.type === 'file') {
                    handlerPath += currentPointer.index;
                } else {
                    if (matchingKey) {
                        handlerPath += matchingKey + '/';
                    } else {
                        handlerPath += item + '/';
                    }
                }
            }
        });

        if (!currentPointer || !currentPointer.type) {
            res.statusCode = 404;
            res.end();
            return;
        }

        if (currentPointer.type === 'dir') {
            if (currentPointer.index) {
                handlerPath += currentPointer.index;
            } else {
                res.statusCode = 404;
                res.end();
                return;
            }
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
