const http = require('http');
const microServer = require('./micro-server');
const setupRoutes = require('./setup-routes');
const basePath = require('./base-path');

function serve() {
    const argv = require('minimist')(process.argv.slice(2));
    const port = argv.p || argv.port || 3000;

    setupRoutes({
        basePath: basePath(),
    })
        .then((availableRoutes) => {
            http.createServer((req, res) => {
                microServer(req, res, availableRoutes);
            }).listen(port, () => {
                console.log('> Listening on ' + port);
            });
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
}
exports.serve = serve;
