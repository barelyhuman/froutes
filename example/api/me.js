module.exports = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.write(JSON.stringify(req.query))
    res.write('Hello World!')
    res.end()
}
