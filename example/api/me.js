module.exports = (req, res) => {
    return res.send({
        query: JSON.stringify(req.query),
        message: 'Hello',
    })
}
