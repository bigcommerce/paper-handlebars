var Code = require('code');
var Lab = require('lab');
var Paper = require('../../index');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.it;

function c(templates, context) {
    return new Paper().loadTemplatesSync(templates).render('template', context);
}

describe('partial and block helpers', function () {
    it('should insert partial into the corresponding block', function (done) {
        var templates = {
                template: '{{#partial "page"}}<h1>{{title}}</h1><p>{{content}}</p>{{/partial}}{{> layout}}',
                layout: '<html><body>{{#block "page"}}{{/block}}</body>/<html>',
            },
            context = {
                title: 'Hello',
                content: 'World',
            };

        expect(c(templates, context))
            .to.contain('<html><body><h1>Hello</h1><p>World</p></body>/<html>');

        done();
    });

    it('should not trigger an error if partial name is empty', function (done) {
        var templates = {
            template: '{{#partial}}World{{/partial}}{{> layout}}',
            layout: 'Hello{{#block "page"}}{{/block}}',
        };

        expect(c(templates, {})).to.be.equal('Hello');

        done();
    });

    it('should not trigger an error if block name is empty', function (done) {
        var templates = {
            template: '{{#partial "page" "2134"}}World{{/partial}}{{> layout}}',
            layout: 'Hello{{#block}}{{/block}}',
        };

        expect(c(templates, {})).to.be.equal('Hello');

        done();
    });
});
