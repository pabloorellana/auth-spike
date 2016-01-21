var email    = { 'type': 'string', 'minLength': 6 },
    username = { 'type': 'string', 'minLength': 1 },
    password = { 'type': 'string', 'minLength': 6 };

var credentials = {
    'id': 'user',
    'type': 'object',
    'properties': {
        'email': email,
        'password': password
    },
    'required': ['email', 'password']
};

var whenCreate = {
    'id': 'user',
    'type': 'object',
    'properties': {
        'email'   : email,
        'username': username,
        'password': password
    },
    'required': ['email', 'password', 'username']
};

var whenUpdate = {
    'id': 'user',
    'type': 'object',
    'properties': {
        'email'   : email,
        'username': username,
        'password': password
    }
};

module.exports = {
    credentials: credentials,
    whenCreate: whenCreate,
    whenUpdate: whenUpdate
}