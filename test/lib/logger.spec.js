'use strict';

const Code = require('code');
const Lab = require('lab');
const Sinon = require('sinon');
const Logger = require('../../lib/logger');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;

describe('Logger', () => {
    const msg = 'Hello';
    const msg2 = 'world';

    it('should log message to console', done => {
        const consoleStub = Sinon.stub(console, 'log');

        Logger.log(msg, msg2);

        expect(consoleStub.calledWith(msg, msg2)).to.be.equal(true);

        consoleStub.restore();

        done();
    });

    it('should log error to console', done => {
        const consoleStub = Sinon.stub(console, 'error');

        Logger.logError(msg, msg2);

        expect(consoleStub.calledWith(msg, msg2)).to.be.equal(true);

        consoleStub.restore();

        done();
    });
});
