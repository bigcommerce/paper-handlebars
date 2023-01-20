const Lab = require('lab');
const { expect } = require('code');
const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const it = lab.it;
const { testRunner, renderString } = require('../spec-helpers');

describe('money helper', function() {
    const context = {
        price: 1234.56,
    };
    const siteSettings = {
        money: {
            currency_location: "left",
            currency_token: "$",
            decimal_places: 2,
            thousands_token: ',',
            decimal_token: '.',
        }
    };


    it('should correctly set money value from money site settings', function(done) {
        const runTestCases = testRunner({context, siteSettings});
        runTestCases([
            {
                input: '{{money price}}',
                output: '$ 1,234.56',
            },
            {
                input: '{{money 12.34}}',
                output: '$ 12.34',
            },
        ], done);
    });

    it('should read money site settings from input parameters', function(done) {
        const runTestCases = testRunner({context, siteSettings});
        runTestCases([
            {
                input: '{{money price 1}}',
                output: '$ 1,234.6',
            },
            {
                input: '{{money price 3}}',
                output: '$ 1,234.560',
            },
            {
                input: '{{money price 2 "."}}',
                output: '$ 1.234.56',
            },
            {
                input: '{{money price 2 "," ","}}',
                output: '$ 1,234,56',
            },
        ], done);
    });

    it('should throw an exception if the price value parameter has an invalid type', function(done) {
        renderString('{{money "hello"}}').catch(err => {
            expect(err.message).to.equal("money helper accepts only Number's as first parameter");
            done();
        });
    });

    it('should throw an exception if the decimal places parameter has an invalid type', function(done) {
        renderString('{{money 1.2 "hello"}}').catch(err => {
            expect(err.message).to.equal("money helper accepts only Number's for decimal places");
            done();
        });
    });
});
