const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('pre helper', function() {
    const runTestCases = testRunner({});

    it('should render an object properly', function(done) {
        runTestCases([
            {
                input: '{{{pre var}}}',
                output: '<pre>{}</pre>',
                context: {var: {}},
            },
        ], done);
    });

    it('should scape html entities', function(done) {
        runTestCases([
            {
                input: '{{{pre var}}}',
                output: '<pre>&quot;&lt;div&gt;&amp;\\&quot;500\\&quot;&lt;/div&gt;&quot;</pre>',
                context: {var: "<div>&\"500\"</div>"},
            },
        ], done);
    });
});
