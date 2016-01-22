'use strict';

var assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru(),
    q = require('q');

var userModelMock = {
        find: function () {},
        findOne: function () {},
        create: function () {},
        findByIdAndUpdate: function () {},
        findByIdAndRemove: function () {}
    },

    res = {
        json: function () { return; }
    },

    formatterMock = {
        excludeProperties: function () {}
    },

    usersController,

    sandbox,

    nextSpy;

describe('users controller', function () {

    beforeEach(function () {
        usersController = proxyquire('../../controllers/users.js', {
            '../models/user': userModelMock,
            '../utils/formatter.js': formatterMock
        });

        sandbox = sinon.sandbox.create();

        nextSpy = sandbox.spy();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('save()', function () {

        it('should the res.errorInfo.status as 409 if the user already exists and call the "next" middleware', function (done) {
            var req = {
                body: {
                    email: 'existinguser@user.com'
                }
            };

            sandbox.stub(userModelMock, 'findOne', function () {
                return q.resolve({ username: 'someexistinguser' });
            });

            usersController.save(req, res, nextSpy);

            process.nextTick(function () {
                assert.isDefined(res.errorInfo);
                assert.equal(res.errorInfo.status, 409);
                assert.isString(res.errorInfo.title);
                assert(nextSpy.calledOnce);
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


            usersController.save(req, res);

            process.nextTick(function () {
                assert(jsonSpy.calledOnce);
                done();
            });
        });

    });

    describe('getAll()', function () {

        it('should set the res.errorInfo.status as 404 if no users are found', function (done) {

            var req = {
                params: {
                    userId: 'userid1'
                }
            };

            sandbox.stub(userModelMock, 'find', function () {
                return q.resolve([]);
            });

            usersController.getAll(req, res, nextSpy);

            process.nextTick(function () {
                assert.isDefined(res.errorInfo);
                assert.equal(res.errorInfo.status, 404);
                assert.isString(res.errorInfo.title);
                assert(nextSpy.calledOnce);
                done();
            });
        });

        it('should return all the users', function (done) {

            var jsonSpy = sandbox.spy(res, 'json');

            sandbox.stub(userModelMock, 'find', function () {
                var fakeUsers = [
                    { username: 'fakeuser1', email: 'fake1@user.com', password: 'pass1' },
                    { username: 'fakeuser2', email: 'fake2@user.com', password: 'pass32' },
                    { username: 'fakeuser3', email: 'fake3@user.com', password: 'pass3' }
                ];
                return q.resolve(fakeUsers);
            });

            usersController.getAll({}, res);

            process.nextTick(function () {
                assert(jsonSpy.calledOnce);
                done();
            });
        });

    });

    describe('getOne()', function () {

        it('should set the res.errorInfo.status as 404 if the specified user is not found', function (done) {

            var req = {
                params: {
                    userId: 'userid1'
                }
            };

            sandbox.stub(userModelMock, 'findOne', function () {
                return q.resolve(null);
            });

            usersController.getOne(req, res, nextSpy);

            process.nextTick(function () {
                assert.isDefined(res.errorInfo);
                assert.equal(res.errorInfo.status, 404);
                assert.isString(res.errorInfo.title);
                assert(nextSpy.calledOnce);
                done();
            });
        });

        it('should return an specific user', function (done) {

            var jsonSpy = sandbox.spy(res, 'json'),
                req = {
                    params: {
                        userId: 'userid1'
                    }
                };

            sandbox.stub(userModelMock, 'findOne', function () {
                var fakeUser = { username: 'fakeuser1', email: 'fake1@user.com', password: 'pass1' };
                return q.resolve(fakeUser);
            });

            usersController.getOne(req, res);

            process.nextTick(function () {
                assert(jsonSpy.calledOnce);
                done();
            });
        });

    });

    describe('update()', function () {

        it('should set the res.errorInfo.status as 404 if the specified user is not found', function (done) {

            var req = {
                params: {
                    userId: 'userid1'
                },
                body: { }
            };

            sandbox.stub(userModelMock, 'findByIdAndUpdate', function () {
                return q.resolve(null);
            });

            usersController.update(req, res, nextSpy);

            process.nextTick(function () {
                assert.isDefined(res.errorInfo);
                assert.equal(res.errorInfo.status, 404);
                assert.isString(res.errorInfo.title);
                assert(nextSpy.calledOnce);
                done();
            });
        });

        it('should update and return an specific user', function (done) {

            var jsonSpy = sandbox.spy(res, 'json'),
                req = {
                    params: {
                        userId: 'userid1'
                    },
                    body: { username: 'fakeuser1', email: 'fake1@user.com', password: 'pass1' }
                };

            sandbox.stub(userModelMock, 'findByIdAndUpdate', function (params) {
                return q.resolve(params);
            });

            usersController.update(req, res);

            process.nextTick(function () {
                assert(jsonSpy.calledOnce);
                done();
            });
        });

    });

    describe('remove()', function () {

        it('should set the res.errorInfo.status as 404 if the specified user is not found', function (done) {

            var req = {
                params: {
                    userId: 'userid1'
                }
            };

            sandbox.stub(userModelMock, 'findByIdAndRemove', function () {
                return q.resolve(null);
            });

            usersController.remove(req, res, nextSpy);

            process.nextTick(function () {
                assert.isDefined(res.errorInfo);
                assert.equal(res.errorInfo.status, 404);
                assert.isString(res.errorInfo.title);
                assert(nextSpy.calledOnce);
                done();
            });
        });

        it('should remove and return an specific user', function (done) {

            var jsonSpy = sandbox.spy(res, 'json'),
                req = {
                    params: {
                        userId: 'userid1'
                    }
                };

            sandbox.stub(userModelMock, 'findByIdAndRemove', function () {
                var fakeUser = { username: 'fakeuser1', email: 'fake1@user.com', password: 'pass1' };
                return q.resolve(fakeUser);
            });

            usersController.remove(req, res);

            process.nextTick(function () {
                assert(jsonSpy.calledOnce);
                done();
            });
        });

    });
});