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

describe('langJson helper', () => {
    let renderer;

    beforeEach(done => {
        renderer = new Renderer();

        renderer.setTranslator({
            getLocale: () => 'en',
            getLanguage: () => ({ locale: 'en' }),
        });

        done();
    });

    it('should return translation as JSON string if translator is defined', done => {
        expect(compile(renderer, '{{{langJson}}}')).to.be.equal(JSON.stringify(renderer.getTranslator().getLanguage()));

        done();
    });

    it('should return an empty object as JSON string if translator is not defined', done => {
        renderer.setTranslator(null);

        expect(compile(renderer, '{{{langJson}}}')).to.be.equal('{}');

        done();
    });
});
