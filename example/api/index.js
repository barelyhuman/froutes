module.exports = (req, res) => {
    if (req.method === 'GET') {
        return res.send({ status: 'up' })
    }
    res.status(400)
    res.send('<h1>Error</h1>')
}
