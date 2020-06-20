module.exports = (req, res) => {
    res.write('From /api/:id/:userId');
    res.write(`\n${JSON.stringify(req.params)}`);
    res.end();
};
