var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    expect = Code.expect,
    it = lab.it,
    renderString = require('../spec-helpers').renderString;

describe('replace helper', function() {
    const templates = {
        template2: 'day',
    };

    const context = {
        content: "Either you run the %%var%% or the  %%var%% runs you",
        price: '$49.99',
    };

    it('should replace all ocurrance of %%var%% with "day"', function(done) {

        expect(renderString("{{#replace '%%var%%' content}}{{> template2}}{{/replace}}", context, {}, {}, templates))
            .to.be.equal('Either you run the day or the  day runs you');

        done();
    });

    it('should handle undefined values', function(done) {
        expect(renderString("{{#replace '%%var%%' content}}{{> template2}}{{/replace}}", {}, {}, {}, templates))
            .to.be.equal('');

        done();
    });

    it('should replace $', function(done) {
        expect(renderString("{{#replace '$' price}}{{/replace}}", context, {}, {}, templates))
            .to.be.equal('49.99');

        expect(renderString("{{#replace '$' '$10.00'}}{{/replace}}", context, {}, {}, templates))
            .to.be.equal('10.00');

        expect(renderString("{{#replace '$' '$10.00'}}USD {{/replace}}", context, {}, {}, templates))
            .to.be.equal('USD 10.00');

        done();
    });

    it('should gracefully handle not strings', function(done) {
        expect(renderString("{{#replace something price}}{{/replace}}", context, {}, {}, templates))
            .to.be.equal('');

        expect(renderString("{{#replace $ '$10.00'}}{{/replace}}", context, {}, {}, templates))
            .to.be.equal('');

        expect(renderString("{{#replace foo bar}}{{/replace}}", context, {}, {}, templates))
            .to.be.equal('');

        done();
    });
});
