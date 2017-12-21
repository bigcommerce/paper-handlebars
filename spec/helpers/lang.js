'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;

const buildRenderer = require('../spec-helpers').buildRenderer;

function renderString(renderer, template, context) {
    return renderer.renderString(template, context);
}

describe('lang helper', () => {
    let context, renderer;

    beforeEach(done => {
        context = {
            name: 'BigCommerce',
        };

        renderer = buildRenderer();
        renderer.setTranslator({
            getLocale: () => 'en',
            translate: (key, params) => `Powered By ${params.name}`,
        });

        done();
    });

    it('should translate the key with attributes', done => {
        expect(renderString(renderer, '{{lang "powered_by" name=name}}', context))
            .to.be.equal('Powered By BigCommerce');

        done();
    });

    it('should return an empty string if translator is undefined', done => {
        renderer.setTranslator(null);

        expect(renderString(renderer, '{{lang "powered_by" name=name}}', context)).to.be.equal('');

        done();
    });
});
