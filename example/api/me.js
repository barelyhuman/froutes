module.exports = (req, res) => {
    return res.send({
        query: req.query,
        message: 'Hello',
    })
}
