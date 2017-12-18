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

describe('compare helper', function() {
    var context = {
        num1: 1,
        num2: 2,
        product: {a: 1, b: 2},
        string: 'yolo'
    };

    it('should render "big" if all compares match', function(done) {

        expect(c('{{#compare "1" num1 operator="=="}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(c('{{#compare 1 num1 operator="==="}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(c('{{#compare 2 num1 operator="!=="}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(c('{{#compare num2 num1 operator="!="}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(c('{{#compare num2 num1 operator=">"}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(c('{{#compare num1 num2 operator="<"}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(c('{{#compare num2 num1 operator=">="}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(c('{{#compare num1 num2 operator="<="}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(c('{{#compare product "object" operator="typeof"}}big{{/compare}}', context))
            .to.be.equal('big');

        expect(c('{{#compare string "string" operator="typeof"}}big{{/compare}}', context))
            .to.be.equal('big');

        done();
    });

    it('should render empty for all cases', function(done) {

        expect(c('{{#compare "2" num1 operator="=="}}big{{/compare}}', context))
            .to.be.equal('');

        expect(c('{{#compare 2 num1 operator="==="}}big{{/compare}}', context))
            .to.be.equal('');

        expect(c('{{#compare 1 num1 operator="!=="}}big{{/compare}}', context))
            .to.be.equal('');

        expect(c('{{#compare num2 2 operator="!="}}big{{/compare}}', context))
            .to.be.equal('');

        expect(c('{{#compare num1 20 operator=">"}}big{{/compare}}', context))
            .to.be.equal('');

        expect(c('{{#compare 4 num2 operator="<"}}big{{/compare}}', context))
            .to.be.equal('');

        expect(c('{{#compare num1 40 operator=">="}}big{{/compare}}', context))
            .to.be.equal('');

        expect(c('{{#compare num2 num1 operator="<="}}big{{/compare}}', context))
            .to.be.equal('');

        expect(c('{{#compare product "string" operator="typeof"}}big{{/compare}}', context))
            .to.be.equal('');

        expect(c('{{#compare string "object" operator="typeof"}}big{{/compare}}', context))
            .to.be.equal('');

        done();
    });

});
