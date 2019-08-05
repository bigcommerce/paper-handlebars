const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('json helper', function() {
    const urlData_2_qs = 'https://cdn.example.com/path/to/{:size}/image.png?c=2&imbypass=on';
    const context = {
        image_with_2_qs: {
            data: urlData_2_qs
        },
        object: { a: 1, b: "hello" }
    };

    const runTestCases = testRunner({context});

    it('should render object to json format', function(done) {
        runTestCases([
            {
                input: '{{{json object}}}',
                output: '{"a":1,"b":"hello"}',
            },
        ], done);
    });
    it('should work together with getImage', function(done) {
        runTestCases([
            {
                input: '{{{json (getImage image_with_2_qs)}}}',
                output: '"https://cdn.example.com/path/to/original/image.png?c=2&imbypass=on"',
            },
        ], done);
    });
});
