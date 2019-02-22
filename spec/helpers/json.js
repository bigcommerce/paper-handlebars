const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it,
      expect = require('code').expect,
      testRunner = require('../spec-helpers').testRunner,
      buildRenderer = require('../spec-helpers').buildRenderer,
      RenderError = require('../../index').errors.RenderError;

describe('json helper', function() {
    const context = {
        object: { a: 1, b: "hello" },
        undef: undefined
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

    it('should fail when provided undefined', function(done) {
        const render = buildRenderer();

        render.renderString('{{{json undef}}}', context).then((result) => {
            return Promise.resolve(null);
        }, (reason) => {
            expect(reason).to.be.an.instanceof(RenderError);
            return Promise.resolve(reason.message);
        }).then((reason) => {
            expect(reason).to.equal("Handlebars Helper 'json' does not allow value of 'undefined'");
            done();
        });
    });
});
