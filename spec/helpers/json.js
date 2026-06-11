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
        object: { a: 1, b: "hello" },
        xss: 'Music</script><script>alert(1)</script>'
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
                output: '"https:\\u002f\\u002fcdn.example.com\\u002fpath\\u002fto\\u002foriginal\\u002fimage.png?c=2&imbypass=on"',
            },
        ], done);
    });

    it('should work together with concat', function(done) {
        runTestCases([
            {
                input: '{{{json (concat \'Hello \' \'World\')}}}',
                output: '"Hello World"',
            },
        ], done);
    });

    it('should escape HTML-unsafe characters so output is safe inside a <script> tag', function(done) {
        runTestCases([
            {
                input: '{{{json xss}}}',
                output: '"Music\\u003c\\u002fscript\\u003e\\u003cscript\\u003ealert(1)\\u003c\\u002fscript\\u003e"',
            },
        ], done);
    });
});
