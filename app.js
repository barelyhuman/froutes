const microServer = require('./lib/micro-server');
const setupRoutes = require('./lib/setup-routes');
const http = require('http');
const PORT = process.env.PORT || 3000;

setupRoutes();

http.createServer((req, res) => {
    microServer(req, res);
}).listen(PORT, () => {
    console.log('> Listening on ' + PORT);
});
