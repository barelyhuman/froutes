module.exports = (req, res) => {
    res.write('from dynamic route')
    res.write('\npath param ' + JSON.stringify(req.params))
    res.end()
}
