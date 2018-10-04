const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      testRunner = require('../spec-helpers').testRunner;

describe('nl2br helper', function() {
    const context = {
        text: "Hello\nmy\nname\nis\nJack"
    };

    const runTestCases = testRunner({context});

    it('should convert new lines to <br> tags', function(done) {
        runTestCases([
            {
                input: '{{nl2br text}}',
                output: 'Hello<br>\nmy<br>\nname<br>\nis<br>\nJack',
            },
        ], done);
    });
});
