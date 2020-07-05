#!/usr/bin/env node

const microServer = require('./lib/micro-server');
const setupRoutes = require('./lib/setup-routes');
const http = require('http');
const PORT = process.env.PORT || 3000;

setupRoutes()
    .then((availableRoutes) => {
        console.log({
            availableRoutes: JSON.stringify(availableRoutes),
        });
        http.createServer((req, res) => {
            microServer(req, res, availableRoutes);
        }).listen(PORT, () => {
            console.log('> Listening on ' + PORT);
        });
    })
    .catch((err) => {
        console.log(err);
        throw err;
    });
