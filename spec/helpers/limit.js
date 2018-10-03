const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('limit helper', function() {
    const runTestCases = testRunner({});

    it('should limit an array properly', function(done) {
        runTestCases([
            {
                input: '{{#each (limit var 4)}}{{this}} {{/each}}',
                output: '1 2 3 4 ',
                context: {var: [1,2,3,4,5,6,7,8]},
            },
        ], done);
    });

    it('should limit an string properly', function(done) {
        runTestCases([
            {
                input: '{{limit var 10}}',
                output: 'This is lo',
                context: {var: "This is longer than the chosen limit"},
            },
        ], done);
    });
});
