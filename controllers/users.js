'use strict';

var formatter = require('../utils/formatter.js'),
    User = require('../models/user');

function save (req, res, next) {

    User.findOne({ email: req.body.email }).then(function (result) {
        if (result) {
            res.errorInfo = { status: 409, title: 'User Already Exists' };
            next();
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
        res.errorInfo = { status: 500 };
        next();
    });
};

function getAll (req, res, next) {
    User.find().then(function (users) {
        if (users.length === 0) {
            res.errorInfo = { status: 404, title: 'No Users Found' };
            return next();
        }

        res.json({
            data: users.map(function (user) {
                return formatter.excludeProperties(user, { password: 0, token: 0 });
            })
        });
    }).catch(function (err) {
        res.errorInfo = { status: 500 };
        next();
    });
};

function getOne (req, res, next) {
    var userId = req.params.userId;

    User.findOne({ _id: userId }).then(function (user) {
        if (!user) {
            res.errorInfo = { status: 404, title: 'User Not Found' };
            return next();
        }

        res.json({
            data: formatter.excludeProperties(user, { password: 0, token: 0 }),
            token: req.token
        });
    }).catch(function (err) {
        res.errorInfo = { status: 500 };
        next();
    });
};

function update (req, res, next) {
    var userId = req.params.userId;

    User.findByIdAndUpdate(userId, req.body, { new: true }).then(function (user) {
        if (!user) {
            res.errorInfo = { status: 404, title: 'User Not Found' };
            return next();
        }

        res.json({
            data: formatter.excludeProperties(user, { password: 0, token: 0 }),
            token: req.token
        });
    }).catch(function (err) {
        res.errorInfo = { status: 500 };
        next();
    });
};

function remove (req, res, next) {
    var userId = req.params.userId;

    User.findByIdAndRemove(userId).then(function (user) {
        if (!user) {
            res.errorInfo = { status: 404, title: 'User Not Found' };
            return next();
        }

        res.json({
            data: formatter.excludeProperties(user, { password: 0, token: 0 }),
            token: req.token
        });
    }).catch(function (err) {
        res.errorInfo = { status: 500 };
        next();
    });
};

module.exports = { save, getAll, getAll, getOne, update, remove };
