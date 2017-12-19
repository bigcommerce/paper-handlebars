var Code = require('code'),
    Lab = require('lab'),
    Renderer = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context) {
    const renderer = new Renderer();
    return renderer.renderString(template, context);
}

describe('json helper', function() {

    it('should render object to json format', function(done) {
        var context = {
            object: {a: 1, b: "hello"}
        };

        expect(c('{{{json object}}}', context))
            .to.contain('{"a":1,"b":"hello"}');

        done();
    });
});
