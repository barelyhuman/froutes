const fs = require('fs').promises;
const path = require('path');

module.exports = async (directory) => {
    const routeTree = {
        api: {},
    };

    let currentPointer = routeTree.api;

    const files = await fs.readdir(directory);
    const treeMods = files.map(async (fileInstance) => {
        const statPath = path.join(directory, fileInstance);
        const fileStat = await fs.stat(statPath);
        if (fileStat.isFile()) {
            debugger;
            if (fileInstance === 'index.js') {
                debugger;
                currentPointer.type = 'dir';
                currentPointer.index = 'index.js';
            } else {
                const noExt = fileInstance.replace('.js', '');
                currentPointer =
                    currentPointer[noExt] || (currentPointer[noExt] = {});
                currentPointer.type = 'file';
                currentPointer.index = fileInstance;
            }
        }
    });

    await Promise.all(treeMods);

    return routeTree;
};
