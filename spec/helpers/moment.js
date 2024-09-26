const Sinon = require('sinon');
const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach,
    testRunner = require('../spec-helpers').testRunner;
const Code = require('code'),
    expect = Code.expect;
const moment = require('moment');

describe('moment helper', function () {
    const runTestCases = testRunner({});

    it('renders the date in the format specified', function (done) {
        const now = new Date();
        runTestCases([
            {
                input: `{{moment "1 year ago" "YYYY"}}`,
                output: `${now.getFullYear() - 1}`,
            },
            {
                input: `{{moment "2 days ago" "YYYY"}}`,
                output: `${now.getFullYear()}`,
            },
            {
                input: `{{moment '2022-06-29' 'DD/MM/YYYY'}}`,
                output: '29/06/2022',
            },
            {
                input: `{{moment '2022-06-30' 'DD/MM/YYYY'}}`,
                output: '30/06/2022',
            },
            {
                input: `{{moment '2022-07-29' 'DD/MM/YYYY'}}`,
                output: '29/07/2022',
            },
            {
                input: `{{moment '2022-07-30' 'DD/MM/YYYY'}}`,
                output: '30/07/2022',
            }
        ], done);
    });

    it('is backwards compatible with helper-date 0.2.3 null-argument behavior', (done) => {
        runTestCases([
            {
                input: `{{moment format="YYYY"}}`,
                output: moment().format('YYYY'),
            },
            {
                input: `{{moment null null}}`,
                output: moment().format('MMMM DD, YYYY'),
            },
            {
                input: `{{moment undefined undefined}}`,
                output: moment().format('MMMM DD, YYYY'),
            },
            {
                input: `{{moment "now" format="YYYY"}}`,
                output: `Invalid date`,
            }
        ], done);
    });

    it('permits use of moment.js functions', (done) => {
        runTestCases([
            {
                input: `{{moment "2022-01-01" isAfter="1999-12-31"}}`,
                output: `true`,
            }
        ], done);
    });

    describe('when amount is provided', () => {
        let consoleWarnCopy = console.warn;
    
        beforeEach(done => {
            console.warn = Sinon.fake();
            done();
        }); 
    
        afterEach(done => {
            console.warn = consoleWarnCopy;
            done();
        });

        it('runs console.warn', (done) => {
            runTestCases([
                {
                    input: `{{moment "2022-01-01" isAfter="1999-12-31" amount=1}}`,
                    output: `true`,
                }
            ], () => {
                expect(console.warn.called).to.equal(true);
                done();
            });

        });
    });
});