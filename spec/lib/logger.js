'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;
const beforeEach = lab.beforeEach;

const Logger = require('../../lib/logger');
const capture = require('../spec-helpers').capture;

describe('Logger', () => {
    const message = "The cheapest, fastest, and most reliable components are those that aren't there."
    let logger;

    beforeEach(done => {
        logger = new Logger();
        done();
    });

    it('should log info', done => {
        let captured = capture(() => {
            logger.info(message);
        });

        expect(captured).to.equal(`${message}\n`);
        done();
    });

    it('should log notice', done => {
        let captured = capture(() => {
            logger.notice(message);
        });

        expect(captured).to.equal(`${message}\n`);
        done();
    });

    it('should log warn', done => {
        let captured = capture(() => {
            logger.warn(message);
        });

        expect(captured).to.equal(`${message}\n`);
        done();
    });

    it('should log error', done => {
        let captured = capture(() => {
            logger.error(message);
        });

        expect(captured).to.equal(`${message}\n`);
        done();
    });

    it('should log crit', done => {
        let captured = capture(() => {
            logger.crit(message);
        });

        expect(captured).to.equal(`${message}\n`);
        done();
    });

    it('should log alert', done => {
        let captured = capture(() => {
            logger.alert(message);
        });

        expect(captured).to.equal(`${message}\n`);
        done();
    });

    it('should log emerg', done => {
        let captured = capture(() => {
            logger.emerg(message);
        });

        expect(captured).to.equal(`${message}\n`);
        done();
    });

    it('should log debug', done => {
        let captured = capture(() => {
            logger.debug(message);
        });

        expect(captured).to.equal(`${message}\n`);
        done();
    });
});
