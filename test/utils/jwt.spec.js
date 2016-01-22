'use strict';

var assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

var token = 'jfggg897908dfkaei8634',

    res = {
        status: function () {
            return this;
        },
        send: function () {
            return;
        }
    },

    jwtMock = {
        sign: function () { return true; },
        verify: function () { return true; }
    },

    JWT_SECRET_MOCK = {
        secret: 'MYSECRETKEY'
    },

    jwtUtils,

    sandbox,

    statusSpy,

    sendSpy;

describe('jwtUtils', function () {

    beforeEach(function () {

        jwtUtils = proxyquire('../../utils/jwt.js', {
            'jsonwebtoken': jwtMock,
            '../config/jwt-secret.json': JWT_SECRET_MOCK
        });

        sandbox = sinon.sandbox.create();

        statusSpy = sandbox.spy(res, 'status');

        sendSpy = sandbox.spy(res, 'send');
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('verifyToken()', function () {

        it('should return 401 if "authorization" header is not present', function () {
            var req = {
                headers: {
                    contentType: 'application/json'
                }
            };

            jwtUtils.verifyToken(req, res, function () {});

            assert(statusSpy.calledOnce);
            assert(statusSpy.calledWith(401));
            assert(sendSpy.calledOnce);
        });

        it('should return 401 if the token is invalid', function () {

            var verifyCallbackSpy = sandbox.spy(function (token, secret, options, cb) {
                    cb('tokenValidationException', null);
                }),

                req = {
                    headers: {
                        authorization: 'bearer ' + token
                    }
                };

            sandbox.stub(jwtMock, 'verify', verifyCallbackSpy);

            jwtUtils.verifyToken(req, res);

            assert(verifyCallbackSpy.calledOnce);
            assert(verifyCallbackSpy.calledWith(
                    token,
                    JWT_SECRET_MOCK.secret,
                    { ignoreExpiration: false }
                )
            );
            assert(statusSpy.calledOnce);
            assert(statusSpy.calledWith(401));
            assert(sendSpy.calledOnce);
        });

        it('should set the "token" attribute to the "response" object and execute the "next" callback', function () {

            var verifyCallbackSpy = sandbox.spy(function (token, secret, options, cb) {
                    cb(null, token);
                }),

                nextSpy = sandbox.spy(),

                req = {
                    headers: {
                        authorization: 'bearer ' + token
                    }
                };

            sandbox.stub(jwtMock, 'verify', verifyCallbackSpy);

            jwtUtils.verifyToken(req, { }, nextSpy);

            assert(verifyCallbackSpy.calledOnce);
            assert(verifyCallbackSpy.calledWith(
                    token,
                    JWT_SECRET_MOCK.secret,
                    { ignoreExpiration: false }
                )
            );
            assert.equal(req.token, token);
            assert(nextSpy.calledOnce);
        });
    });
});

