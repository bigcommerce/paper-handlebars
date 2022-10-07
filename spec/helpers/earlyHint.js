const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    beforeEach = lab.beforeEach;
const {buildRenderer, testRunner} = require("../spec-helpers");
const {expect} = require("code");
const {
    resourceHintAllowedTypes,
    resourceHintAllowedStates,
    resourceHintAllowedCors
} = require("../../helpers/lib/resourceHints");

function template(path, state, type, cors) {
    cors = cors ? `cors="${cors}"` : '';
    type = cors ? `as="${type}"` : '';
    return `{{ earlyHint "${path}" "${state}" ${type} ${cors} }}`;
}

function randommer(items) {
    return () => items[Math.floor(Math.random() * items.length)];
}

const randomHintState = randommer(Object.values(resourceHintAllowedStates));
const randomHintType = randommer(Object.values(resourceHintAllowedTypes));
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
        const type = randomHintType();
        const cors = randomCors();
        const input = template(path, state, type, cors);
        runTests([
            {
                input,
                output: path
            }
        ], () => {
            const hints = renderer.getResourceHints();
            expect(hints).to.have.length(1);
            expect(hints[0]).to.equals({src: path, state, type, cors});
            done();
        });
    });

});
