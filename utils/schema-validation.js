var jsonSchemaValidator = require('jsonschema');

exports.validate = function (schemaDefinition) {

    return function (req, res, next) {

        var validation = jsonSchemaValidator.validate(req.body, schemaDefinition);

        if (validation.errors.length > 0 ) {
            var errors = validation.errors.map(function (error){
                return {
                        'status': '400',
                        'title':  'Schema Validation Error',
                        'detail': error.stack.replace('instance.', '')
                                    .replace('instance', 'schema')
                                    .replace(/"/g, '\'')
                    }
            });

            res.status(400).send({
                'errors': errors
            });

            return;
        }

        next();
    }
};