var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context) {
    return new Paper().loadTemplatesSync({template: template}).render('template', context);
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
