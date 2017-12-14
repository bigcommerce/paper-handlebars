var Code = require('code'),
    Lab = require('lab'),
    Paper = require('../../index'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it;

function c(template, context) {
    return new Paper().loadTemplatesSync({ template, template2: "day" }).render('template', context);
}

describe('replace helper', function() {
    const context = {
        content: "Either you run the %%var%% or the  %%var%% runs you",
        price: '$49.99',
    };

    it('should replace all ocurrance of %%var%% with "day"', function(done) {

        expect(c("{{#replace '%%var%%' content}}{{> template2}}{{/replace}}", context))
            .to.be.equal('Either you run the day or the  day runs you');

        done();
    });

    it('should handle undefined values', function(done) {
        const context = {};
        expect(c("{{#replace '%%var%%' content}}{{> template2}}{{/replace}}", context))
            .to.be.equal('');

        done();
    });

    it('should replace $', function(done) {
        expect(c("{{#replace '$' price}}{{/replace}}", context))
            .to.be.equal('49.99');

        expect(c("{{#replace '$' '$10.00'}}{{/replace}}", context))
            .to.be.equal('10.00');

        expect(c("{{#replace '$' '$10.00'}}USD {{/replace}}", context))
            .to.be.equal('USD 10.00');

        done();
    });

    it('should gracefully handle not strings', function(done) {
        expect(c("{{#replace something price}}{{/replace}}", context))
            .to.be.equal('');

        expect(c("{{#replace $ '$10.00'}}{{/replace}}", context))
            .to.be.equal('');

        expect(c("{{#replace foo bar}}{{/replace}}", context))
            .to.be.equal('');

        done();
    });
});
