#!/usr/bin/env node

const microServer = require('./lib/micro-server')
const setupRoutes = require('./lib/setup-routes')
const warn = require('./lib/warn')

const initProject = require('./lib/init-project')
const { serve } = require('./lib/serve')

function main() {
    const argv = require('minimist')(process.argv.slice(2))
    if (process.argv[1].includes('routex')) {
        warn(
            'routex has been renamed/replaced by ftrouter, You can fix it by renaming your executables to ftrouter.'
        )
    }

    if (argv.init) {
        return initProject()
    }

    return serve()
}

process.on('uncaughtException', (err) => {
    throw err
})

process.on('unhandledRejection', (err) => {
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
