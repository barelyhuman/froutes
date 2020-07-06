module.exports = (req, res) => {
    if (req.method === 'GET') {
        return res.send('Dynamic folder route')
    }
    res.status(404)
    return res.end()
}
