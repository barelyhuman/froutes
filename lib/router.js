const parseUrl = require('./parse-url')
const { send, status } = require('./request-helpers')

module.exports = async (availableRoutes, req, res) => {
    try {
        const parsedRouteUrl = parseUrl(req.url)
        res.send = send(res)
        res.status = status(res)
        req.query = parsedRouteUrl.query

        let pathName = parsedRouteUrl.url.pathname

        if (pathName[pathName.length - 1] === '/') {
            pathName = pathName.slice(0, pathName.length - 1)
        }

        if (availableRoutes.hasOwnProperty(pathName)) {
            return availableRoutes[pathName].handler(req, res)
        }

        let match = false
        for (let k in availableRoutes) {
            if (!availableRoutes[k].parser.parse.test(pathName)) {
                continue
            }
            if (typeof availableRoutes[k].handler !== 'function') {
                continue
            }

            match = true
            req.params = availableRoutes[k].parser.getParam(pathName)
            availableRoutes[k].handler(req, res)
            break
        }

        if (!match) {
            res.status(404)
            return res.end()
        }
    } catch (err) {
        console.error(err)
        res.status(500)
        res.end()
        throw err
    }
}
