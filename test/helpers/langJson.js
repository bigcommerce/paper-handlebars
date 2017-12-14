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

describe('langJson helper', () => {
    let paper;

    beforeEach(done => {
        paper = new Paper();

        paper.translator = {
            getLocale: () => 'en',
            getLanguage: () => ({ locale: 'en' }),
        };

        done();
    });

    it('should return translation as JSON string if translator is defined', done => {
        expect(compile(paper, '{{{langJson}}}')).to.be.equal(JSON.stringify(paper.translator.getLanguage()));

        done();
    });

    it('should return an empty object as JSON string if translator is not defined', done => {
        paper.translator = null;

        expect(compile(paper, '{{{langJson}}}')).to.be.equal('{}');

        done();
    });
});
