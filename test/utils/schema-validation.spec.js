'use strict';

var assert = require('chai').assert,
    sinon = require('sinon'),
    proxyquire = require('proxyquire').noCallThru();

var jsonschemaMock  = {
        validate: function () { return; }
    },

    req = {
        body: {}
    },

    res = {
        status: function () {
            return this;
        },
        send: function () {
            return;
        }
    },

    schemaDefinition = {},

    schemaValidation,

    sandbox,

    statusSpy,

    sendSpy,

    nextSpy;

describe('schema-validation', function () {

    beforeEach(function () {

        schemaValidation = proxyquire('../../utils/schema-validation.js', {
            'jsonschema': jsonschemaMock
        });

        sandbox = sinon.sandbox.create();

        statusSpy = sandbox.spy(res, 'status'),

        sendSpy = sandbox.spy(res, 'send'),

        nextSpy = sandbox.spy();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('validate()', function () {

        it('should return 400 and not execute the "next" callback if there is any validation error', function () {

            sandbox.stub(jsonschemaMock, 'validate', function () {
                return {
                    errors: [{
                        stack: 'instance requires username'
                    }]
                }
            });

            schemaValidation.validate(schemaDefinition)(req, res, nextSpy);

            assert(statusSpy.calledOnce);

            assert(statusSpy.calledWith(400));

            assert(sendSpy.calledOnce);

            assert.isFalse(nextSpy.calledOnce);
        });

        it('should execute the "next" callback if there are no validation errors', function () {

            var nextSpy = sandbox.spy();

            sandbox.stub(jsonschemaMock, 'validate', function () {
                return {
                    errors: []
                }
            });

            schemaValidation.validate(schemaDefinition)(req, res, nextSpy);

            assert(nextSpy.calledOnce);
        });

    });

});