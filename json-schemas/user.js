var email    = { 'type': 'string', 'minLength': 6 },
    username = { 'type': 'string', 'minLength': 1 },
    password = { 'type': 'string', 'minLength': 6 };

var credentials = {
    'id': 'user',
    'type': 'object',
    'properties': { email, password },
    'required': ['email', 'password']
};

var whenCreate = {
    'id': 'user',
    'type': 'object',
    'properties': { email, username, password },
    'required': ['email', 'password', 'username']
};

var whenUpdate = {
    'id': 'user',
    'type': 'object',
    'properties': { email, username, password }
};

module.exports = { credentials, whenCreate, whenUpdate };