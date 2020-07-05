const fs = require('fs');
const path = require('path');
const createRouteDir = require('./create-route-dir');
const createAvailableRoutes = require('./create-available-routes');
const ora = require('ora');

module.exports = async (directory) => {
    try {
        const spinner = ora('Compiling...').start();
        const availableRoutesTree = await createAvailableRoutes(directory);
        spinner.succeed('Compiled');
        return availableRoutesTree;
    } catch (err) {
        spinner.color = 'red';
        spinner.text = 'Failed';
        spinner.fail();
        console.error(err);
        throw err;
    }
};
