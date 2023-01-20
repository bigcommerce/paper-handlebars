const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('dynamicComponent helper', function() {
    const templates = {
              'component/fields/one': '1{{animal}}',
              'component/fields/two': '2{{animal}}',
              'component/fields/three': '3{{animal}}',
          },
          context = {
              fields: [
                  {partial: 'one', animal: 'dog'},
                  {partial: 'two', animal: 'cat'},
                  {partial: 'three', animal: 'mouse'},
              ],
              field: {partial: 'two', animal: 'elephant'}
          };

    // Build a test runner
    const runTestCases = testRunner({context, templates});

    it('should render all dynamic templates accordingly', function(done) {
        runTestCases([
            {
                input: '{{#each fields}}{{dynamicComponent "component/fields"}} {{/each}}',
                output: '1dog 2cat 3mouse ',
            },
        ], done);
    });

    it('should return undefined when accessing proto/constructor', function(done) {
        runTestCases([
            {
                input: '{{#each fields}}{{dynamicComponent "__proto__"}}{{/each}}',
                output: '',
            },
            {
                input: '{{#each fields}}{{dynamicComponent "constructor"}}{{/each}}',
                output: '',
            },
        ], done);
    });
});

