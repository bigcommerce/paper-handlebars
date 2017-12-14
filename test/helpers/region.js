'use strict';

const Code = require('code');
const Lab = require('lab');
const Paper = require('../../index');

const lab = exports.lab = Lab.script();
const before = lab.before;
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.it;

function compile(paper, template, context) {
    context = context || {};
    return paper.loadTemplatesSync({
        template: template
    }).render('template', context);
}

describe('Region Helper', () => {
    let context;
    let paper;

    before(done => {
        context = {
            regions: {
                'banner-top': "hello world"
            }
        };

        paper = new Paper();
        paper.contentServiceContext = context;

        done();
    });

    it('should return an empty string if no content service data (missing contentServiceContext) on page context', done => {
        let noPaperContext = new Paper();
        expect(compile(noPaperContext, '{{region name="banner-bottom"}}', context))
            .to.be.equal('');

        done();
    });

    it('should return an empty container if no matching region on context object', done => {
        expect(compile(paper, '{{region name="banner-bottom"}}', context))
            .to.be.equal('<div data-content-region="banner-bottom"></div>');

        done();
    });

    it('should return Hello World', done => {
        expect(compile(paper, '{{region name="banner-top"}}', context))
            .to.be.equal('<div data-content-region="banner-top">hello world</div>');

        done();
    });

});
