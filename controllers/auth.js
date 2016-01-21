module.exports = function (app) {

    var jwtUtils = require('../utils/jwt.js'),
        User = require('../models/user'),
        formatter = require('../utils/formatter.js'),
        userSchema = require('../json-schemas/user.js'),
        schemaValidator = require('../utils/schema-validation.js');

    app.post('/authenticate', schemaValidator.validate(userSchema), function(req, res) {
        var params = {
            email: req.body.email,
            password: req.body.password
        };

        User.findOne({ email: params.email}).then(function (user) {
            if (!user) {
                res.json({ data: 'User not found.'});
                return;
            }


            if (user.validPassword(params.password)) {
                res.json({ 
                    data: formatter.excludeProperties(user, { password: 0, token: 0 }),
                    token: user.token
                });

               return;
            }

            res.json({ data: 'Incorrect email or password' });
        })
        .catch(function (err) {
            res.sendStatus(500);
            return;
        });
    });


    app.post('/signin', schemaValidator.validate(userSchema), function(req, res) {

        User.findOne({ email: req.body.email }).then(function (result) {
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

            return User.create(params).then(function (user) {
                res.json({
                    data: formatter.excludeProperties(user, { password: 0, token: 0 }),
                    token: user.token
                });
                
                return;
            });
        }).catch(function (err) {
            res.sendStatus(500);
            return;
        });
    });

    /*app.get('/me', jwtUtils.verifyToken, function(req, res) {
        User.findOne({ token: req.token }).then(function (user) {
            res.json({ data: user, token: user.token });
        }).catch(function (err) {
            res.sendStatus(500);
            return;
        });
    });*/
}