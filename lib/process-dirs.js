const fs = require('fs');
const path = require('path');
const router = require('./router');

module.exports = async (directory, req, res) => {
    try {
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

        return router(availableRoutes, req, res);
    } catch (err) {
        console.error(err);
        throw err;
    }
};
