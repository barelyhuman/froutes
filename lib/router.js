const basePath = require('./base-path');
const path = require('path');
const parseUrl = require('./parse-url');
const fs = require('fs');

module.exports = async (availableRoutes, req, res) => {
    try {
        const parsedRouteUrl = parseUrl(req.url);
        let handlerPath = '';
        let currentPointer = availableRoutes;
        parsedRouteUrl.forEach((item) => {
            currentPointer = currentPointer[item];
            if (currentPointer) {
                if (currentPointer.type === 'file') {
                    handlerPath += currentPointer.index;
                } else if (currentPointer.type === 'dir') {
                    handlerPath += item + '/';
                }
            } else {
                res.statusCode = 404;
                res.end();
            }
        });

        if (currentPointer.type === 'dir') {
            handlerPath += currentPointer.index;
        }

        let _handlerPath = path.join(basePath(), handlerPath);

        const exists = await new Promise((resolve, reject) => {
            fs.stat(_handlerPath, (err, stat) => {
                if (
                    (err && err.code === 'ENOENT') ||
                    (err && err.code === 'ENOTDIR')
                ) {
                    resolve(false);
                }
                return resolve(true);
            });
        });

        if (!exists) {
            res.statusCode = 404;
            res.end();
            return;
        }

        const handler = require(_handlerPath);
        return handler(req, res);
    } catch (err) {
        console.error(err);
        res.statusCode(500);
        res.end();
        throw err;
    }
};
