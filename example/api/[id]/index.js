module.exports = (req, res) => {
    if (req.method === 'GET') {
        res.write('Dynamic folder route')
        res.end()
        return
    }
    res.statusCode = 404
    res.end()
    return
}
