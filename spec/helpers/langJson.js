'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.experiment;
const it = lab.it;

const specHelpers = require('../spec-helpers');
const buildRenderer = specHelpers.buildRenderer;
const testRunner = specHelpers.testRunner;

describe('langJson helper', () => {
    let renderer, runTestCases;

    beforeEach(done => {
        renderer = buildRenderer();
        renderer.setTranslator({
            getLocale: () => 'en',
            getLanguage: () => ({ locale: 'en' }),
        });

        runTestCases = testRunner({renderer});

        done();
    });

    it('should return translation as JSON string if translator is defined', done => {
        runTestCases([
            {
                input: '{{{langJson}}}',
                output: JSON.stringify(renderer.getTranslator().getLanguage()),
            },
        ], done);
    });

    it('should return an empty object as JSON string if translator is not defined', done => {
        renderer.setTranslator(null);

        runTestCases([
            {
                input: '{{{langJson}}}',
                output: '{}',
            },
        ], done);
    });
});
