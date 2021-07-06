'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const before = lab.before;
const describe = lab.experiment;
const it = lab.it;

const specHelpers = require('../spec-helpers');
const buildRenderer = specHelpers.buildRenderer;
const testRunner = specHelpers.testRunner;

describe('Region Helper', () => {
    let context, renderer, runTestCases;

    before(done => {
        context = {
            'banner-top': "hello world"
        };

        renderer = buildRenderer();
        renderer.setContent(context);

        runTestCases = testRunner({context, renderer});

        done();
    });

    it('should return an empty container if using empty content context', done => {
        runTestCases([
            {
                input: '{{region name="banner-bottom" translation="i18n.RegionName.TestingTranslation"}}',
                output: '<div data-content-region="banner-bottom" data-content-region-translation="i18n.RegionName.TestingTranslation"></div>',
                renderer: buildRenderer(),
            },
        ], done);
    });

    it('should return an empty container if no matching region on context object', done => {
        runTestCases([
            {
                input: '{{region name="banner-bottom" translation="i18n.RegionName.TestingTranslation"}}',
                output: '<div data-content-region="banner-bottom" data-content-region-translation="i18n.RegionName.TestingTranslation"></div>',
            },
        ], done);
    });

    it('should return without region translation data attribute if no translation is provided', done => {
        runTestCases([
            {
                input: '{{region name="banner-bottom"}}',
                output: '<div data-content-region="banner-bottom"></div>',
            },
        ], done);
    });

    it('should return Hello World', done => {
        runTestCases([
            {
                input: '{{region name="banner-top" translation="i18n.RegionName.TestingTranslation"}}',
                output: '<div data-content-region="banner-top" data-content-region-translation="i18n.RegionName.TestingTranslation">hello world</div>',
            },
        ], done);
    });
});
