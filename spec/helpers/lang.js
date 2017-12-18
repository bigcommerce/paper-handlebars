'use strict';

const Code = require('code');
const Lab = require('lab');
const Renderer = require('../../index');

const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;

function compile(renderer, template, context) {
    context = context || {};
    return renderer.renderString(template, context);
}

describe('lang helper', () => {
    let context;
    let renderer;

    beforeEach(done => {
        context = {
            name: 'BigCommerce',
        };

        renderer = new Renderer();

        renderer.setTranslator({
            getLocale: () => 'en',
            translate: (key, params) => `Powered By ${params.name}`,
        });

        done();
    });

    it('should translate the key with attributes', done => {
        expect(compile(renderer, '{{lang "powered_by" name=name}}', context))
            .to.be.equal('Powered By BigCommerce');

        done();
    });

    it('should return an empty string if translator is undefined', done => {
        renderer.setTranslator(null);

        expect(compile(renderer, '{{lang "powered_by" name=name}}', context)).to.be.equal('');

        done();
    });
});
