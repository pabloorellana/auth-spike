'use strict';

var assert = require('chai').assert,
    formatter = require('../../utils/formatter.js');

var userMock = {
    username: 'USER1',
    email: 'user@user.com',
    password: 'myPassword',
    secret: 'mySecret'
};

describe('formatter', function () {

    describe('excludeProperties()', function() {

        it('should exclude the properties configured as 0 from an object', function () {

            var excludedProperties = {
                'password': 0,
                'secret': 0
            };

            var result = formatter.excludeProperties(userMock, excludedProperties);
            assert.notProperty(result, 'password');
            assert.notProperty(result, 'secret');
        });

        it('should not exclude any properties from an object', function () {

            var excludedProperties = {
                'password': 1,
                'secret': 1
            };

            var result = formatter.excludeProperties(userMock, excludedProperties);
            assert.property(result, 'password');
            assert.property(result, 'secret');
        });

        it('should exclude only the properties configured as 0', function () {

            var excludedProperties = {
                'password': 1,
                'secret': 0
            };

            var result = formatter.excludeProperties(userMock, excludedProperties);
            assert.property(result, 'password');
            assert.notProperty(result, 'secret');
        });

        it('should exclude the properties only if the are configured as 0', function () {

            var excludedProperties = {
                'password': 9,
                'secret': '0'
            };

            var result = formatter.excludeProperties(userMock, excludedProperties);
            assert.property(result, 'password');
            assert.property(result, 'secret');
        });

    });

});