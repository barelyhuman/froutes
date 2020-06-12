const router = require('./router');
const getAvailableRoutes = require('./get-available-routes');

module.exports = async (req, res) => {
    try {
        const availableRoutes = await getAvailableRoutes();

        return router(availableRoutes, req, res);
    } catch (err) {
        console.error(err);
        throw err;
    }
};
