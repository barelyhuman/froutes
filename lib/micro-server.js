const router = require('./router')

module.exports = async (req, res, availableRoutes) => {
    try {
        return router(availableRoutes, req, res)
    } catch (err) {
        console.error(err)
        throw err
    }
}
