const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    beforeEach = lab.beforeEach;
const {buildRenderer, testRunner} = require("../spec-helpers");
const {expect} = require("code");
const {resourceHintAllowedTypes} = require("../../helpers/lib/resourceHints");

function template(path, state, type) {
    type = type ? `type="${type}"` : '';
    return `{{ earlyHint "${path}" "${state}" ${type} }}`;
}

function randommer(items) {
    return () => items[Math.floor(Math.random() * items.length)];
}

const randomHintState = randommer(['preload', 'preconnect', 'prefetch']);
const randomHintType = randommer(Object.values(resourceHintAllowedTypes));

let renderer, runTests;

describe('earlyHint', () => {

    beforeEach(done => {
        renderer = buildRenderer();
        runTests = testRunner({renderer});
        done();
    });

    it('should create a resource hint with only required properties', done => {
        const path = '/asset/theme.css'
        const state = randomHintState();
        const input = template(path, state);
        runTests([
            {
                input,
                output: path
            }
        ], () => {
            const hints = renderer.getResourceHints();
            expect(hints).to.have.length(1);
            expect(hints[0]).to.equals({src: path, state});
            done();
        });
    });

    it('should create a resource hint with all the properties', done => {
        const path = '/asset/theme.css'
        const type = randomHintType();
        const state = randomHintState();
        const input = template(path, state, type);
        runTests([
            {
                input,
                output: path
            }
        ], () => {
            const hints = renderer.getResourceHints();
            expect(hints).to.have.length(1);
            expect(hints[0]).to.equals({src: path, state, type});
            done();
        });
    });

});
