const basePath = require('./base-path');
const fs = require('fs');
const path = require('path');
const checkApiDir = require('./check-api-dir');
const processDirectories = require('./process-dirs');

module.exports = () => {
    fs.readdir(basePath(), function (err, dirs) {
        if (err) throw err;
        const apiDirExists = checkApiDir(dirs);
        if (!apiDirExists.valid) {
            throw new Error('cannot find an `api` directory');
        }
        const processingPath = path.join(basePath(), apiDirExists.path);
        return processDirectories(processingPath);
    });
};
