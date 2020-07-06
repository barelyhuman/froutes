#!/usr/bin/env node

const microServer = require('./lib/micro-server')
const setupRoutes = require('./lib/setup-routes')
const http = require('http')

const argv = require('minimist')(process.argv.slice(2))
const port = argv.p || argv.port || 3000

setupRoutes()
    .then((availableRoutes) => {
        http.createServer((req, res) => {
            microServer(req, res, availableRoutes)
        }).listen(port, () => {
            console.log('> Listening on ' + port)
        })
    })
    .catch((err) => {
        console.log(err)
        throw err
    })

process.on('uncaughtException', (err) => {
    console.error(err)
    throw err
})
