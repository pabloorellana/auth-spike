var router = require('express').Router(),
    authController = require('../controllers/auth.js'),
    jwtUtils = require('../utils/jwt.js'),
    userSchema = require('../json-schemas/user.js'),
    schemaValidator = require('../utils/schema-validation.js');

router.post('/authenticate', schemaValidator.validate(userSchema.credentials), authController.authenticate);
router.post('/signin', schemaValidator.validate(userSchema.whenCreate), authController.signin);

module.exports = router;
