module.exports = (req, res) => {
    res.write('path param ' + JSON.stringify(req.params)); // {"id":1};
    res.end();
};
