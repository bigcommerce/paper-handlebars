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
    defaultResourceHintState,
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

        it("creates resource hints when valid params are provided", (done) => {

            const globals = {resourceHints: []};
            sandbox.spy(globals.resourceHints, 'push');

            const src = '/my/styles.css';
            const type = 'style';
            const state = 'preload';
            const expected = {src, state, type};

            addResourceHint(globals, src, state, type);

            expect(globals.resourceHints.push.calledOnce).to.equals(true);
            expect(globals.resourceHints[0]).to.equals(expected);

            done();
        });

        it('does not add a hint when provided path is invalid', (done) => {
            const globals = {resourceHints: []};
            sandbox.spy(globals.resourceHints, 'push');

            const throws = [undefined, null, ''].map(s => {
                return () => {
                    addResourceHint(
                        global,
                        s,
                        defaultResourceHintState,
                        resourceHintAllowedTypes.resourceHintStyleType
                    );
                };
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
                defaultResourceHintState
            );

            expect(globals.resourceHints.push.calledOnce).to.equals(true);
            expect(globals.resourceHints[0].type).to.not.exist();

            done();
        });

        it('does not create a hint when provided state param is not supported', (done) => {
            const globals = {resourceHints: []};
            sandbox.spy(globals.resourceHints, 'push');

            const f = () => addResourceHint(
                globals,
                '/styles.css',
                'not-supported'
            );
            expect(f).to.throw();

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
            const filled = Array(50).fill(1);
            const globals = {resourceHints: filled};
            sandbox.spy(globals.resourceHints, 'push');

            addResourceHint(
                globals,
                '/my/styles.css',
                'preload',
                'style'
            );

            expect(globals.resourceHints.push.notCalled).to.equals(true);

            done();
        });

    });
});
