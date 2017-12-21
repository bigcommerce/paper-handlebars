var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

describe('json helper', function() {

    it('should render object to json format', function(done) {
        var context = {
            object: {a: 1, b: "hello"}
        };

        expect(renderString('{{{json object}}}', context))
            .to.contain('{"a":1,"b":"hello"}');

        done();
    });
});
