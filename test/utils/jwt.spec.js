'use strict';

var assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire');

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

    sandbox;

describe('jwtUtils', function () {

    beforeEach(function () {

        jwtUtils = proxyquire('../../utils/jwt.js', {
            'jsonwebtoken': jwtMock,
            '../config/jwt-secret.json': JWT_SECRET_MOCK
        });

        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('verifyToken', function () {

        it('should return 401 if "authorization" header is not present', function () {
            var req = {
                    headers: {
                        contentType: 'application/json'
                    }
                },

                spyStatus = sandbox.spy(res, 'status'),

                spySend = sandbox.spy(res, 'send');

            jwtUtils.verifyToken(req, res, function () {});
            assert(spyStatus.calledOnce);
            assert(spyStatus.calledWith(401));
            assert(spySend.calledOnce);
        });

        it('should return 401 if the token is invalid', function () {

            var verifyCallbackSpy = sandbox.spy(function (token, secret, options, cb) {
                    cb('tokenValidationException', null);
                }),

                jwtStub = sandbox.stub(jwtMock, 'verify', verifyCallbackSpy),

                spyStatus = sandbox.spy(res, 'status'),

                spySend = sandbox.spy(res, 'send'),

                req = {
                    headers: {
                        authorization: 'bearer ' + token
                    }
                };

            jwtUtils.verifyToken(req, res);
            assert(verifyCallbackSpy.calledOnce);
            assert(verifyCallbackSpy.calledWith(
                    token,
                    JWT_SECRET_MOCK.secret,
                    { ignoreExpiration: false }
                )
            );
            assert(spyStatus.calledOnce);
            assert(spyStatus.calledWith(401));
            assert(spySend.calledOnce);
        });

        it('should set the "token" attribute to the "response" object and execute the "next" callback', function () {

            var verifyCallbackSpy = sandbox.spy(function (token, secret, options, cb) {
                    cb(null, token);
                }),

                nextSpy = sandbox.spy(),

                jwtStub = sandbox.stub(jwtMock, 'verify', verifyCallbackSpy),

                req = {
                    headers: {
                        authorization: 'bearer ' + token
                    }
                },

                response = { };

            jwtUtils.verifyToken(req, response, nextSpy);
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

