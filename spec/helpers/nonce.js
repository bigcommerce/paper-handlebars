const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it}  = lab;
const {testRunner, buildRenderer, randomString} = require('../spec-helpers');

describe('nonce helper', function () {
    const context = {}

    it('should render a nonce in quotes with the correct value from request params', function (done) {
        const requestParams = {
            security: {
                nonce: randomString()
            },
        }
        const renderer = buildRenderer({}, {}, {}, null, requestParams);
        const runTestCases = testRunner({context, renderer});
        runTestCases([
            {
                input: '{{nonce}}',
                output: requestParams.security.nonce,
            },
        ], done);
    });

    it('should not render a nonce since request param is empty', function (done) {
        const requestParams = {
            security: {},
        }
        const renderer = buildRenderer({}, {}, {}, null, requestParams);
        const runTestCases = testRunner({context, renderer});
        runTestCases([
            {
                input: '{{nonce}}',
                output: '',
            },
        ], done);
    });
});