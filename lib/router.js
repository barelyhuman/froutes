const parseUrl = require('./parse-url')
const { send, status } = require('./request-helpers')

module.exports = async (availableRoutes, req, res) => {
    try {
        const parsedRouteUrl = parseUrl(req.url)

        let handlerPath = ''
        let currentPointer = availableRoutes['.']

        res.send = send(res)
        res.status = status(res)
        req.query = parsedRouteUrl.query

        for (let i = 0; i < parsedRouteUrl.paths.length; i += 1) {
            const item = parsedRouteUrl.paths[i]
            let matchingKey
            if (!currentPointer[item]) {
                for (let k in currentPointer) {
                    if (
                        currentPointer[k].params &&
                        currentPointer[k].params.length > 0
                    ) {
                        matchingKey = k
                        break
                    }
                }

                if (matchingKey) {
                    currentPointer = currentPointer[matchingKey]
                    const key = matchingKey.replace(/[\[\]]/g, '')
                    req.params = {
                        ...req.params,
                        [key]: item,
                    }
                } else {
                    currentPointer = null
                    break
                }
            } else {
                currentPointer = currentPointer[item]
            }

            if (currentPointer) {
                if (currentPointer.type === 'file') {
                    handlerPath += currentPointer.index
                } else {
                    if (matchingKey) {
                        handlerPath += matchingKey + '/'
                    } else {
                        handlerPath += item + '/'
                    }
                }
            }
        }

        if (!currentPointer || !currentPointer.type) {
            res.statusCode = 404
            res.end()
            return
        }

        if (currentPointer.type === 'dir') {
            if (currentPointer.index) {
                return currentPointer.index(req, res)
            } else {
                res.statusCode = 404
                return res.end()
            }
        } else {
            return currentPointer.index(req, res)
        }
    } catch (err) {
        console.error(err)
        res.status(500)
        res.end()
        throw err
    }
}
