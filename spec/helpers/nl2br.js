var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

describe('nl2br helper', function() {
    var context = {
        text: "Hello\nmy\nname\nis\nJack"
    };

    it('should convert new lines to <br> tags', function(done) {

        expect(renderString('{{nl2br text}}', context))
            .to.be.equal('Hello<br>\nmy<br>\nname<br>\nis<br>\nJack');

        done();
    });
});
