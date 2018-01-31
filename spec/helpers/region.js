'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const before = lab.before;
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;

const buildRenderer = require('../spec-helpers').buildRenderer;

function renderString(renderer, template, context) {
    return renderer.renderString(template, context);
}

describe('Region Helper', () => {
    let context, renderer;

    before(done => {
        context = {
            'banner-top': "hello world"
        };

        renderer = buildRenderer();
        renderer.setContent(context);

        done();
    });

    it('should return an empty string if no content service data (missing contentServiceContext) on page context', done => {
        const noContent = buildRenderer();
        expect(renderString(noContent, '{{region name="banner-bottom"}}', context))
            .to.be.equal('');

        done();
    });

    it('should return an empty container if no matching region on context object', done => {
        expect(renderString(renderer, '{{region name="banner-bottom"}}', context))
            .to.be.equal('<div data-content-region="banner-bottom"></div>');

        done();
    });

    it('should return Hello World', done => {
        expect(renderString(renderer, '{{region name="banner-top"}}', context))
            .to.be.equal('<div data-content-region="banner-top">hello world</div>');

        done();
    });

});
