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

describe('inject helper', function() {
    var context = {
        value1: "Big",
        value2: "Commerce",
    };

    it('should inject variables', function(done) {
        var template = "{{inject 'data1' value1}}{{inject 'data2' value2}}{{jsContext}}";

        expect(c(template, context))
            .to.be.equal('"{\\"data1\\":\\"Big\\",\\"data2\\":\\"Commerce\\"}"');

        done();
    });
});
