module.exports = function (app) {

    var jwtUtils = require('../utils/jwt.js'),
        formatter = require('../utils/formatter.js'),
        User = require('../models/user');

    app.post('/users', jwtUtils.verifyToken, function(req, res) {

        var params = {
            email: req.body.email || '',
            password: req.body.password || ''
        };

        User.findOne({ email: params.email }).then(function (result) {
            if (result) {
                res.json({ data: 'User already exists.'});
                return true;
            }

        }).then(function (userExists) {
            if (userExists) { return; }

            return User.create(params).then(function (user) {
                res.json({
                    data: formatter.excludeProperties(user, { password: 0, token: 0 }),
                    token: 'senderToken'
                });
                return;
            });
        }).catch(function (err) {
            res.sendStatus(500);
            return;
        });
    });

    app.get('/users', jwtUtils.verifyToken, function(req, res) {
        User.find().then(function (users) {
            res.json({
                data: users.map(function (user) {
                    return formatter.excludeProperties(user, { password: 0, token: 0 });
                })
            });
        }).catch(function (err) {
            res.sendStatus(500);
            return;
        });
    });

    app.get('/users/:userId', jwtUtils.verifyToken, function(req, res) {
        var userId = req.params.userId;

        User.findOne({ _id: userId }).then(function (user) {
            if (!user) {
                res.json({ data: 'User not found.'});
                return;
            }

            res.json({
                data: formatter.excludeProperties(user, { password: 0, token: 0 }),
                token: 'senderToken'
            });
        }).catch(function (err) {
            res.sendStatus(500);
            return;
        });
    });

    app.put('/users/:userId', jwtUtils.verifyToken, function(req, res) {
        var userId = req.params.userId,
            params = {
                email: req.body.email,
                password: req.body.password
            };

        User.findByIdAndUpdate(userId, params, { new: true }).then(function (user) {
            if (!user) {
                res.json({ data: 'User not found.'});
                return;
            }

            res.json({
                data: formatter.excludeProperties(user, { password: 0, token: 0 }),
                token: 'senderToken'
            });
        }).catch(function (err) {
            res.sendStatus(500);
            return;
        });
    });

    app.delete('/users/:userId', jwtUtils.verifyToken, function(req, res) {
        var userId = req.params.userId;

        User.findByIdAndRemove(userId).then(function (user) {
            if (!user) {
                res.json({ data: 'User not found.'});
                return;
            }

            res.json({
                data: formatter.excludeProperties(user, { password: 0, token: 0 }),
                token: 'senderToken'
            });
        }).catch(function (err) {
            res.sendStatus(500);
            return;
        });
    });
}