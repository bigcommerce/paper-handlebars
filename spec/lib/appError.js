'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;
const helpers = require('../spec-helpers');

const AppError = require('../../lib/appError');
class CustomError extends AppError {};

describe('AppError', () => {
    it('is an instance of Error', done => {
        try {
            throw new AppError();
        } catch(e) {
            expect(e instanceof Error).to.be.true();
        }
        done();
    });

    it('keeps track of the message', done => {
        const msg = helpers.randomString();
        try {
            throw new AppError(msg);
        } catch(e) {
            expect(e.message).to.equal(msg);
        }
        done();
    });

    it('keeps track of the extra details', done => {
        const msg = helpers.randomString();
        const data = helpers.randomString();
        try {
            throw new AppError(msg, { data });
        } catch(e) {
            expect(e.details.data).to.equal(data);
        }
        done();
    });

    it('supplies default details hash', done => {
        const msg = helpers.randomString();
        try {
            throw new AppError(msg);
        } catch(e) {
            expect(e.details).to.equal({});
        }
        done();
    });

    it('makes the error name available', done => {
        try {
            throw new AppError();
        } catch(e) {
            expect(e.name).to.equal('AppError');
        }
        done();
    });

    it('does not include AppError constructor in stack trace', done => {
        const bug = () => {
            throw new AppError();
        };

        try {
            bug();
        } catch(e) {
            expect(e.stack.includes('at bug')).to.be.true();
            expect(e.stack.includes('at AppError')).to.be.false();
        }
        done();
    });
});

describe('subclassing', () => {
    it('is an instance of Error', done => {
        try {
            throw new CustomError();
        } catch(e) {
            expect(e instanceof Error).to.be.true();
        }
        done();
    });

    it('makes the error name available', done => {
        try {
            throw new CustomError();
        } catch(e) {
            expect(e.name).to.equal('CustomError');
        }
        done();
    });
});
