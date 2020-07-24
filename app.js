#!/usr/bin/env node

const http = require('http')

const microServer = require('./lib/micro-server')
const setupRoutes = require('./lib/setup-routes')
const warn = require('./lib/warn')
const basePath = require('./lib/base-path')

function main() {
    const argv = require('minimist')(process.argv.slice(2))
    const port = argv.p || argv.port || 3000

    if (process.argv[1].includes('routex')) {
        warn(
            'routex has been renamed/replaced by ftrouter, You can fix it by renaming your executables to ftrouter.'
        )
    }

    setupRoutes({
        basePath: basePath(),
    })
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
}

process.on('uncaughtException', (err) => {
    console.error(err)
    throw err
})

process.on('unhandledRejection', (err) => {
    console.error(err)
    throw err
})

function expose() {
    return (config) => {
        return setupRoutes(config).then((availableRoutes) => {
            const handler = (req, res) => microServer(req, res, availableRoutes)
            return handler
        })
    }
}

if (require.main == module) {
    main()
} else {
    module.exports = expose()
}
