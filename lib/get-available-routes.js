const fs = require('fs');
const createRouteDir = require('./create-route-dir');
const path = require('path');

module.exports = async () => {
    const routeDir = await createRouteDir();

    return new Promise((resolve, reject) => {
        fs.readFile(path.join(routeDir, 'routes.json'), (err, data) => {
            if (err) reject(err);
            resolve(JSON.parse(Buffer.from(data).toString()));
        });
    });
};
