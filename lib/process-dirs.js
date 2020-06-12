const fs = require('fs');
const path = require('path');
const createRouteDir = require('./create-route-dir');
const ora = require('ora');

module.exports = async (directory) => {
    try {
        const spinner = ora('Compiling...').start();

        const availableRoutes = [];
        const files = await new Promise((resolve, reject) => {
            fs.readdir(directory, function (err, files) {
                if (err) reject(err);
                resolve(files);
            });
        });

        const fileStatsPromises = files.map((fileInstance) => {
            const pathToCheck = path.join(directory, fileInstance);
            return new Promise((resolve, reject) => {
                fs.stat(pathToCheck, function (err, fileStat) {
                    if (err) reject(err);
                    resolve(fileStat);
                });
            }).then((stat) => {
                stat.filename = fileInstance;
                return stat;
            });
        });

        const fileStats = await Promise.all(fileStatsPromises);

        fileStats.forEach((fileStat) => {
            if (fileStat.isFile()) {
                const withoutExtension = fileStat.filename.replace('.js', '');
                if (withoutExtension === 'index') {
                    availableRoutes.push(`/api`);
                }
                availableRoutes.push(`/api/${withoutExtension}`);
            }
        });

        const routePath = await createRouteDir();

        await new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(routePath, 'routes.json'),
                JSON.stringify(availableRoutes),
                (err, done) => {
                    if (err) reject(err);
                    resolve(done);
                }
            );
        });

        setTimeout(() => {
            spinner.color = 'green';
            spinner.text = 'Compiled';
            spinner.succeed();
        }, 1000);
    } catch (err) {
        console.error(err);
        throw err;
    }
};
