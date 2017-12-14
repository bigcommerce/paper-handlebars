'use strict';

const Code = require('code');
const Lab = require('lab');
const Paper = require('../../index');

const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;

function compile(paper, template, context) {
    context = context || {};

    return paper.loadTemplatesSync({ template: template }).render('template', context);
}

describe('lang helper', () => {
    let context;
    let paper;

    beforeEach(done => {
        context = {
            name: 'BigCommerce',
        };

        paper = new Paper();

        paper.translator = {
            getLocale: () => 'en',
            translate: (key, params) => `Powered By ${params.name}`,
        };

        done();
    });

    it('should translate the key with attributes', done => {
        expect(compile(paper, '{{lang "powered_by" name=name}}', context))
            .to.be.equal('Powered By BigCommerce');

        done();
    });

    it('should return an empty string if translator is undefined', done => {
        paper.translator = null;

        expect(compile(paper, '{{lang "powered_by" name=name}}', context)).to.be.equal('');

        done();
    });
});
