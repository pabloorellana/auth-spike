var jwt = require('jsonwebtoken'),
    JWT_SECRET = require('../config/jwt-secret.json').secret;

function generateToken (params) {
    var options = {
        expiresIn: '30m'
    };

    return jwt.sign(JSON.parse(JSON.stringify(params)), JWT_SECRET, options);
}

function verifyToken (req, res, next) {
    var bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        res.status(401).send({
            'errors': [
                {
                    'status': '401',
                    'title':  'Unauthorized',
                    'detail': ''
                }
            ]
        });
        return;
    }

    var token = bearerHeader.split(' ')[1];
    var options = {
        ignoreExpiration: false
    };

    jwt.verify(token, JWT_SECRET, options, function (err, result) {
        if (err) {
            res.status(401).send({
                'errors': [
                    {
                        'status': '401',
                        'title':  'Access Token Expired',
                        'detail': ''
                    }
                ]
            });
            return;
        }

        req.token = token;
        next();
    });
}

module.exports = { generateToken, verifyToken };