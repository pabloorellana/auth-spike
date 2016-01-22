'use strict';

var assert = require('chai').assert,
    sinon = require('sinon'),
    formatter = require('../../utils/formatter.js');

var userMock = {
        username: 'USER1',
        email: 'user@user.com',
        password: 'myPassword',
        secret: 'mySecret'
    },
    res = {
        status: function () { return this; },
        send: function () {}
    },

    statusSpy,

    sendSpy,

    sandbox;

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

    describe('formatErrorResponse()', function () {

        beforeEach(function () {
            sandbox = sinon.sandbox.create();

            statusSpy = sandbox.spy(res, 'status');

            sendSpy = sandbox.spy(res, 'send');
        });

        afterEach(function () {
            sandbox.restore();
        });

        it('should create an 404 "Not Found" error message', function () {
            res.errorInfo = {
                status: 404
            };

            formatter.formatErrorResponse({ }, res);

            assert(statusSpy.calledOnce);
            assert(statusSpy.calledWith(404));
            assert(sendSpy.calledWith({
                errors: [
                    {
                        'status': res.errorInfo.status.toString(),
                        'title':  'Not Found',
                        'detail': ''
                    }
                ]
            }));
        });

        it('should create an 409 "Custom Conflic" error message', function () {
            res.errorInfo = {
                status: 409,
                title: 'Custom Conflic',
                detail: 'This a custom detail message'
            };

            formatter.formatErrorResponse({ }, res);

            assert(statusSpy.calledOnce);
            assert(statusSpy.calledWith(409));
            assert(sendSpy.calledWith({
                errors: [
                    {
                        'status': res.errorInfo.status.toString(),
                        'title': res.errorInfo.title,
                        'detail': res.errorInfo.detail
                    }
                ]
            }));
        });

        it('should return standard 500 error when there is no handler for the specified status', function () {
            res.errorInfo = {
                status: 600
            };

            formatter.formatErrorResponse({ }, res);

            assert(statusSpy.calledOnce);
            assert(statusSpy.calledWith(500));
            assert(sendSpy.calledWith({
                errors: [
                    {
                        'status': '500',
                        'title' : 'Internal Server Error',
                        'detail': 'Something went wrong.'
                    }
                ]
            }));
        });
    });

});