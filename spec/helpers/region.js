'use strict';

const Code = require('code');
const Lab = require('lab');
const Renderer = require('../../index');

const lab = exports.lab = Lab.script();
const before = lab.before;
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;

function compile(renderer, template, context) {
    context = context || {};
    return renderer.renderString(template, context);
}

describe('Region Helper', () => {
    let context;
    let renderer;

    before(done => {
        context = {
            'banner-top': "hello world"
        };

        renderer = new Renderer();
        renderer.addContent(context);

        done();
    });

    it('should return an empty string if no content service data (missing contentServiceContext) on page context', done => {
        const noPaperContext = new Renderer();
        const rendered = compile(noPaperContext, '{{region name="banner-bottom"}}', context);
        console.log(rendered);
        expect(rendered)
            .to.be.equal('');

        done();
    });

    it('should return an empty container if no matching region on context object', done => {
        expect(compile(renderer, '{{region name="banner-bottom"}}', context))
            .to.be.equal('<div data-content-region="banner-bottom"></div>');

        done();
    });

    it('should return Hello World', done => {
        expect(compile(renderer, '{{region name="banner-top"}}', context))
            .to.be.equal('<div data-content-region="banner-top">hello world</div>');

        done();
    });

});
