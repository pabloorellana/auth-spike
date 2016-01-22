'use strict';

var assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru(),
    q = require('q');

var userModelMock = {
        findOne: function () {},
        create: function () {}
    },

    res = {
        status: function () { return this; },
        send: function () { return; },
        json: function () { return; }
    },

    formatterMock = {
        excludeProperties: function () {}
    },

    authController,

    sandbox,

    statusSpy,

    sendSpy;

describe('auth controller', function () {

    beforeEach(function () {
        authController = proxyquire('../../controllers/auth.js', {
            '../models/user': userModelMock,
            '../utils/formatter.js': formatterMock
        });

        sandbox = sinon.sandbox.create();

        statusSpy = sandbox.spy(res, 'status'),

        sendSpy = sandbox.spy(res, 'send');
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('authenticate()', function () {

        it('should return 404 if the user is not found', function (done) {
            var req = {
                    body: {
                        email: 'unexistinguser@user.com'
                    }
                },

                findOneStub = sandbox.stub(userModelMock, 'findOne', function () {
                    return q.resolve(null);
                });

                authController.authenticate(req, res);

            process.nextTick(function () {
                assert(statusSpy.calledOnce);
                assert(statusSpy.calledWith(404));
                assert(sendSpy.calledOnce);
                done();
            });
        });

        it('should return a response if user\'s credentials are valid', function (done) {

            var req = {
                    body: {
                        email: 'existinguser@user.com',
                        password: 'avalidpassword'
                    }
                },

                findOneStub = sandbox.stub(userModelMock, 'findOne', function () {
                    var userFound = {
                        validPassword: function () {
                            return true;
                        }
                    };
                    return q.resolve(userFound);
                }),

                jsonSpy = sandbox.spy(res, 'json');

            authController.authenticate(req, res);

            process.nextTick(function () {
                assert(jsonSpy.calledOnce);
                done();
            });
        });

        it('should return 401 if user\'s credentials are invalid', function (done) {

            var req = {
                    body: {
                        email: 'existinguser@user.com',
                        password: 'wrongpassword'
                    }
                },

                findOneStub = sandbox.stub(userModelMock, 'findOne', function () {
                    var userFound = {
                        validPassword: function () {
                            return false;
                        }
                    };
                    return q.resolve(userFound);
                });

            authController.authenticate(req, res);

            process.nextTick(function () {
                assert(statusSpy.calledOnce);
                assert(statusSpy.calledWith(401));
                assert(sendSpy.calledOnce);
                done();
            });
        });
    });

    describe('signin()', function () {

        it('should return 409 if the user already exists', function (done) {
            var req = {
                    body: {
                        email: 'existinguser@user.com'
                    }
                },

                findOneStub = sandbox.stub(userModelMock, 'findOne', function () {
                    return q.resolve({ username: 'someexistinguser' });
                });

            authController.signin(req, res);

            process.nextTick(function () {
                assert(statusSpy.calledOnce);
                assert(statusSpy.calledWith(409));
                assert(sendSpy.calledOnce);
                done();
            });
        });

        it('should create a new user', function (done) {
            var req = {
                    body: {
                        username: 'newusername',
                        email: 'newuser@user.com',
                        password: 'newuserpassword'
                    }
                },


                jsonSpy = sandbox.spy(res, 'json');

            sandbox.stub(userModelMock, 'findOne', function () {
                return q.resolve(null);
            });

            sandbox.stub(userModelMock, 'create', function (params) {
                return q.resolve(params);
            });

            authController.signin(req, res);

            process.nextTick(function () {
                assert(jsonSpy.calledOnce);
                done();
            });
        });
    });
});