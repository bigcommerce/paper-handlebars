'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.experiment;
const it = lab.it;

const specHelpers = require('../spec-helpers');
const buildRenderer = specHelpers.buildRenderer;
const testRunner = specHelpers.testRunner;

describe('lang helper', () => {
    let context, renderer, runTestCases;

    beforeEach(done => {
        context = {
            name: 'BigCommerce',
        };

        renderer = buildRenderer();
        renderer.setTranslator({
            getLocale: () => 'en',
            translate: (key, params) => `Powered By ${params.name}`,
        });

        runTestCases = testRunner({renderer, context});

        done();
    });

    it('should translate the key with attributes', done => {
        runTestCases([
            {
                input: '{{lang "powered_by" name=name}}',
                output: 'Powered By BigCommerce',
            },
        ], done);
    });

    it('should return an empty string if translator is undefined', done => {
        renderer.setTranslator(null);

        runTestCases([
            {
                input: '{{lang "powered_by" name=name}}',
                output: '',
            },
        ], done);
    });
});
