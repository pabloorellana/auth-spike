var jsonSchemaValidator = require('jsonschema');

exports.validate = function (schemaDefinition) {

    return function (req, res, next) {
        var validation = jsonSchemaValidator.validate(req.body, schemaDefinition);

        if (validation.errors.length > 0 ) {
            res.sendStatus(400);
            return;
        }

        next();
    }
};