const setContentType = require('./set-content-type');

exports.status = (res) => {
    return (code) => {
        if (typeof code !== 'number') {
            throw new Error('Status Code should be a number');
        }
        return (res.statusCode = code);
    };
};

exports.send = (res) => {
    return (body) => {
        let _body = body;
        if (Buffer.isBuffer(body)) {
            setContentType(res, 'buffer');
        } else if (typeof body === 'string') {
            setContentType(res, 'text');
        } else if (
            typeof body === 'object' ||
            typeof body === 'boolean' ||
            typeof body === 'number'
        ) {
            if (_body === null) {
                _body = '';
            }
            _body = JSON.stringify(_body);
            setContentType(res, 'json');
        }

        res.write(_body);
        res.end();
        return;
    };
};
