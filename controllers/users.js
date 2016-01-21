'use strict';

var formatter = require('../utils/formatter.js'),
    User = require('../models/user');

var internalServerErrorStatus = {
    'errors': [
        {
            'status': '500',
            'title' : 'Internal Server Error',
            'detail': 'Something went wrong'
        }
    ]
};

function save (req, res) {

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
            email   : req.body.email,
            password: req.body.password
        };

        return User.create(params).then(function (user) {
            res.json({
                data: formatter.excludeProperties(user, { password: 0, token: 0 }),
                token: req.token
            });
        });
    }).catch(function (err) {
        res.status(500).send(internalServerErrorStatus);
    });
};

function getAll (req, res) {
    User.find().then(function (users) {
        res.json({
            data: users.map(function (user) {
                return formatter.excludeProperties(user, { password: 0, token: 0 });
            })
        });
    }).catch(function (err) {
        res.status(500).send(internalServerErrorStatus);
    });
};

function getOne (req, res) {
    var userId = req.params.userId;

    User.findOne({ _id: userId }).then(function (user) {
        if (!user) {
            res.status(404).send({
                'errors': [
                    {
                        'status': '404',
                        'title':  'User Not Found',
                        'detail': 'Could not find any user with the id' + userId
                    }
                ]
            });
            return;
        }

        res.json({
            data: formatter.excludeProperties(user, { password: 0, token: 0 }),
            token: req.token
        });
    }).catch(function (err) {
        res.status(500).send(internalServerErrorStatus);
    });
};

function update (req, res) {
    var userId = req.params.userId;

    User.findByIdAndUpdate(userId, req.body, { new: true }).then(function (user) {
        if (!user) {
            res.status(404).send({
                'errors': [
                    {
                        'status': '404',
                        'title':  'User Not Found',
                        'detail': 'Could not find any user with the id' + userId
                    }
                ]
            });
            return;
        }

        res.json({
            data: formatter.excludeProperties(user, { password: 0, token: 0 }),
            token: req.token
        });
    }).catch(function (err) {
        res.status(500).send(internalServerErrorStatus);
        return;
    });
};

function remove (req, res) {
    var userId = req.params.userId;

    User.findByIdAndRemove(userId).then(function (user) {
        if (!user) {
            res.status(404).send({
                'errors': [
                    {
                        'status': '404',
                        'title':  'User Not Found',
                        'detail': 'Could not find any user with the id' + userId
                    }
                ]
            });
            return;
        }

        res.json({
            data: formatter.excludeProperties(user, { password: 0, token: 0 }),
            token: req.token
        });
    }).catch(function (err) {
        res.status(500).send(internalServerErrorStatus);
    });
};

module.exports = { save, getAll, getAll, getOne, update, remove };
