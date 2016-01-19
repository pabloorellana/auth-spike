module.exports = function (app) {

    var jwtUtils = require('../utils/jwt.js'),
        UserModel = require('../models/user'),
        userSchema = require('../json-schemas/user.js'),
        schemaValidator = require('../utils/schema-validation.js');

    app.post('/authenticate', schemaValidator.validate(userSchema), function(req, res) {
        var params = {
            email: req.body.email,
            password: req.body.password
        };

        UserModel.findOne({ email: params.email}).then(function (user) {
            if (user.validPassword(params.password)) {
               res.json({ data: user, token: user.token });
               return;
            }

            res.json({ data: 'Incorrect email/password' });
        })
        .catch(function (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        });
    });


    app.post('/signin', schemaValidator.validate(userSchema), function(req, res) {

        UserModel.findOne({ email: req.body.email }).then(function (result) {
            if (result) {
                res.json({ data: 'User already exists.'});
                return true;
            }

        }).then(function (userExists) {
            if (userExists) { return; }

            var params = {
                email: req.body.email,
                password: req.body.password
            };

            return UserModel.create(params).then(function (user) {
                res.json({ data: user, token: user.token });
                return;
            });
        }).catch(function (err) {
            res.sendStatus(500);
            return;
        });
    });

    app.get('/me', jwtUtils.verifyToken, function(req, res) {
        UserModel.findOne({ token: req.token }).then(function (user) {
            res.json({ data: user, token: user.token });
        }).catch(function (err) {
            res.sendStatus(500);
            return;
        });
    });
}