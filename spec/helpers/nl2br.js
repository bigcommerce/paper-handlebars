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

describe('nl2br helper', function() {
    var context = {
        text: "Hello\nmy\nname\nis\nJack"
    };

    it('should convert new lines to <br> tags', function(done) {

        expect(c('{{nl2br text}}', context))
            .to.be.equal('Hello<br>\nmy<br>\nname<br>\nis<br>\nJack');

        done();
    });
});
