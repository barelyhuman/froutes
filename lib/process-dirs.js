const fs = require('fs');
const path = require('path');
const createRouteDir = require('./create-route-dir');
const createAvailableRoutes = require('./create-available-routes');
const log = require('./log');

module.exports = async (directory) => {
    const logInstance = log('Compiling...');
    try {
        const availableRoutesTree = await createAvailableRoutes(directory);

        const routePath = await createRouteDir();

        await new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(routePath, 'routes.json'),
                JSON.stringify(availableRoutesTree),
                (err, done) => {
                    if (err) reject(err);
                    resolve(done);
                }
            );
        });

        setTimeout(() => {
            logInstance('Compiled\n');
        }, 1000);
    } catch (err) {
        spinner.color = 'red';
        spinner.text = 'Failed';
        spinner.fail();
        console.error(err);
        throw err;
    }
};
