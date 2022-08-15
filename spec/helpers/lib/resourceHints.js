const _ = require('lodash');
const Code = require('code'),
    expect = Code.expect;
const Sinon = require('sinon');
const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach;
const {
    addResourceHint,
    defaultResourceHintSate,
    resourceHintAllowedTypes
} = require('../../../helpers/lib/resourceHints');

describe('resource hints', function () {

    describe('addResourceHint', function () {

        let sandbox;

        beforeEach(done => {
            sandbox = Sinon.createSandbox();
            done();
        });

        afterEach(done => {
            sandbox.restore();
            done();
        });

        it("does work as expected with valid params", (done) => {

            const globals = {resourceHints: []};
            sandbox.spy(globals.resourceHints, 'push');

            const src = '/my/styles.css';
            const type = 'style';
            const state = 'preload';
            const expected = {src, state, type};

            addResourceHint(globals, src, state, type);

            expect(globals.resourceHints.push.called).to.equals(true);
            expect(globals.resourceHints).to.have.length(1);
            const result = _.head(globals.resourceHints);
            expect(result).to.equals(expected);

            done();
        });

        it('does not add a hint when provided path is invalid', (done) => {
            const globals = {resourceHints: []};
            sandbox.spy(globals.resourceHints, 'push');

            const throws = [undefined, null, ''].map(s => {
                const f = () => {
                    addResourceHint(
                        global,
                        s,
                        defaultResourceHintSate,
                        resourceHintAllowedTypes.resourceHintStyleType
                    );
                }
                return f;
            });

            throws.forEach(t => {
                expect(t).to.throw();
            });

            expect(globals.resourceHints.push.notCalled).to.equals(true);

            done();
        });

        it('does create a hint when no type is provided', (done) => {
            const globals = {resourceHints: []};
            sandbox.spy(globals.resourceHints, 'push');

            addResourceHint(
                globals,
                'https://my.asset.css',
                defaultResourceHintSate
            );

            expect(globals.resourceHints.push.calledOnce).to.equals(true);
            const hint = _.head(globals.resourceHints);
            expect(hint.type).to.not.exist();

            done();
        });

        it('does not create a hint when provided state param is not supported', (done) => {
            const globals = {resourceHints: []};
            sandbox.spy(globals.resourceHints, 'push');

            addResourceHint(
                globals,
                '/styles.css',
                'not-supported'
            );

            expect(globals.resourceHints.push.notCalled).to.equals(true);

            done();
        });

        it('does not create duplicate, by src, hints', (done) => {
            const globals = {resourceHints: []};
            sandbox.spy(globals.resourceHints, 'push');

            const src = '/my/styles.css';
            const type = 'style';
            const state = 'preload';

            for (let i = 0; i < 5; i++) {
                addResourceHint(
                    globals,
                    src,
                    state,
                    type
                );
            }

            expect(globals.resourceHints.push.calledOnce).to.equals(true);
            expect(globals.resourceHints).to.have.length(1);

            done();
        });

        it('does not create any hint when the limit of allowed hints was reached', (done) => {
            const filled = _.fill(Array(50), 1);
            const globals = {resourceHints: filled};
            sandbox.spy(globals.resourceHints, 'push');

            addResourceHint(
                globals,
                '/my/styles.css',
                'style',
                'preload'
            );

            expect(globals.resourceHints.push.notCalled).to.equals(true);

            done();
        });

    });
});
