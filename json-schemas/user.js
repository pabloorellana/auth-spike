module.exports = {
    'id': 'user',
    'type': 'object',
    'properties': {
        'email': {
            'type': 'string',
            'minLength': 6
        },
        'username': {
            'type': 'string',
            'minLength': 1
        },
        'password': {
            'type': 'string',
            'minLength': 6
        }
    },
    'required': [
        'email',
        'password',
        'username'
    ]
};