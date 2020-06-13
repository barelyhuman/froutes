module.exports = (req, res) => {
    res.write(JSON.stringify(req.params));
    res.end();
};
