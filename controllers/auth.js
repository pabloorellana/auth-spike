'use strict';

var User = require('../models/user'),
    formatter = require('../utils/formatter.js');

function authenticate (req, res) {

    User.findOne({ email: req.body.email }).then(function (user) {
        if (!user) {
            res.status(404).send({
                'errors': [
                    {
                        'status': '404',
                        'title':  'User Not Found',
                        'detail': 'Could not find any user ' + req.body.email
                    }
                ]
            });

            return;
        }


        if (user.validPassword(req.body.password)) {
            res.json({
                data: formatter.excludeProperties(user, { password: 0, token: 0 }),
                token: user.token
            });

           return;
        }

        res.status(401).send({
            'errors': [
                {
                    'status': '401',
                    'title':  'Invalid Credentials',
                    'detail': 'Incorrect email or password'
                }
            ]
        });
    }).catch(function (err) {
        res.status(500).send({
            'errors': [
                {
                    'status': '500',
                    'title':  'Internal Server Error',
                    'detail': 'Something went wrong'
                }
            ]
        });
        return;
    });
};

function signin (req, res) {

    User.findOne({ email: req.body.email }).then(function (result) {
        if (result) {
            res.status(409).send({
                'errors': [
                    {
                        'status': '409',
                        'title':  'User Already Exists',
                        'detail': 'There is already a registered user with the email ' + req.body.email
                    }
                ]
            });

            return true;
        }

    }).then(function (userExists) {
        if (userExists) { return; }

        var params = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };

        return User.create(params).then(function (user) {
            res.json({
                data: formatter.excludeProperties(user, { password: 0, token: 0 }),
                token: user.token
            });

            return;
        });
    }).catch(function (err) {
        res.status(500).send({
            'errors': [
                {
                    'status': '500',
                    'title':  'Internal Server Error',
                    'detail': 'Something went wrong'
                }
            ]
        });
        return;
    });
};

/*function me (req, res) {
    User.findOne({ token: req.token }).then(function (user) {
        res.json({ data: user, token: user.token });
    }).catch(function (err) {
        res.sendStatus(500);
        return;
    });
};*/

module.exports = { authenticate, signin };
