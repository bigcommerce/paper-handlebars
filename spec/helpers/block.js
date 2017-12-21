const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;
const render = require('../spec-helpers').render;

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

        expect(render('template', context, {}, {}, templates))
            .to.contain('<html><body><h1>Hello</h1><p>World</p></body>/<html>');

        done();
    });

    it('should not trigger an error if partial name is empty', function (done) {
        var templates = {
            template: '{{#partial}}World{{/partial}}{{> layout}}',
            layout: 'Hello{{#block "page"}}{{/block}}',
        };

        expect(render('template', {}, {}, {}, templates)).to.be.equal('Hello');

        done();
    });

    it('should not trigger an error if block name is empty', function (done) {
        var templates = {
            template: '{{#partial "page" "2134"}}World{{/partial}}{{> layout}}',
            layout: 'Hello{{#block}}{{/block}}',
        };

        expect(render('template', {}, {}, {}, templates)).to.be.equal('Hello');

        done();
    });
});
