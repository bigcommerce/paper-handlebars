const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    beforeEach = lab.beforeEach;
const {buildRenderer, testRunner} = require("../spec-helpers");
const {expect} = require("code");
const {
    resourceHintAllowedStates,
    resourceHintAllowedCors
} = require("../../helpers/lib/resourceHints");

function template(path, state, cors) {
    cors = cors ? `cors="${cors}"` : '';
    return `{{ earlyHint "${path}" "${state}" ${cors} }}`;
}

function randommer(items) {
    return () => items[Math.floor(Math.random() * items.length)];
}

const randomHintState = randommer(Object.values(resourceHintAllowedStates));
const randomCors = randommer(Object.values(resourceHintAllowedCors));

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
            expect(hints[0]).to.equals({src: path, state, cors: 'no'});
            done();
        });
    });

    it('should create a resource hint with all the properties', done => {
        const path = '/asset/theme.css'
        const state = randomHintState();
        const cors = randomCors();
        const input = template(path, state, cors);
        runTests([
            {
                input,
                output: path
            }
        ], () => {
            const hints = renderer.getResourceHints();
            expect(hints).to.have.length(1);
            expect(hints[0]).to.equals({src: path, state, cors});
            done();
        });
    });

});
