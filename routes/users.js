var router = require('express').Router(),
    usersController = require('../controllers/users.js'),
    jwtUtils = require('../utils/jwt.js'),
    userSchema = require('../json-schemas/user.js'),
    schemaValidator = require('../utils/schema-validation.js'),
    formatter = require('../utils/formatter.js');

router.post('/',
    jwtUtils.verifyToken,

    schemaValidator.validate(userSchema.whenCreate),

    usersController.save,

    formatter.formatErrorResponse
);

router.get('/',
    jwtUtils.verifyToken,

    usersController.getAll,

    formatter.formatErrorResponse
);

router.get('/:userId',
    jwtUtils.verifyToken,

    usersController.getOne,

    formatter.formatErrorResponse
);

router.put('/:userId',
    jwtUtils.verifyToken,

    schemaValidator.validate(userSchema.whenUpdate),

    usersController.update,

    formatter.formatErrorResponse
);

router.delete('/:userId',
    jwtUtils.verifyToken,

    usersController.remove,

    formatter.formatErrorResponse
);

module.exports = router;
