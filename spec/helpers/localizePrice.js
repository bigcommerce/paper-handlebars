require('full-icu');

const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      specHelpers = require('../spec-helpers'),
      testRunner = specHelpers.testRunner

describe('localizePrice helper', function() {
    const context = {
        "price": {
            "tax_label": "GST",
            "without_tax": {
                "currency": "USD",
                "formatted": "$123,456.78",
                "value": 123456.78
            }
        }
    };

    const runTestCases = testRunner({context});

    it('should return return correct prices across a number of locales', function(done) {
        runTestCases([
            {
                input: '{{localizePrice price.without_tax "en-US"}}',
                output: '$123,456.78',
            },
            {
                input: '{{localizePrice price.without_tax "ja-JP"}}',
                output: '$123,456.78',
            },
            {
                input: '{{localizePrice price.without_tax "de"}}',
                output: '123.456,78 $',
            },
        ], done);
    });
});
