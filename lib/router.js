const basePath = require('./base-path');
const path = require('path');

module.exports = (availableRoutes, req, res) => {
    const matchingRouteString = availableRoutes.indexOf(req.url);

    if (matchingRouteString < 0) {
        res.statusCode = 404;
        res.end();
    } else {
        const matchingRouterHandler = availableRoutes[matchingRouteString];

        const handlerPath = path.join(basePath(), matchingRouterHandler);

        const handler = require(handlerPath);

        handler(req, res);
    }

    return;
};
