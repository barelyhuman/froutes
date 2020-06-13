module.exports = (req, res) => {
    res.write('Deleting,' + JSON.stringify(req.params));
    res.end();
};
