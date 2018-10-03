const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('pluck helper', function() {
    const context = {
        users: [
          { 'user': 'barney', 'age': 36 },
          { 'user': 'fred',   'age': 40 }
        ]
    };

    const runTestCases = testRunner({context});

    it('should get the values from all elements in collection', function(done) {
        runTestCases([
            {
                input: '{{pluck users "age"}}',
                output: '36,40',
            },
            {
                input: '{{#each (pluck users "user")}}hello {{this}} {{/each}}',
                output: 'hello barney hello fred ',
            },
        ], done);
    });
});
