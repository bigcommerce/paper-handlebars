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
const ResourceHints = require('../../../helpers/lib/resourceHints');

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

            let globals = {resourceHints: []};
            sandbox.spy(globals.resourceHints, 'push');

            let src = '/my/styles.css';
            let type = 'style';
            let state = 'preload';
            let expected = {src, state, type};

            ResourceHints.addResourceHint(globals, src, state, type);

            expect(globals.resourceHints.push.called).to.equals(true);
            expect(globals.resourceHints).to.have.length(1);
            let result = _.head(globals.resourceHints);
            expect(result).to.equals(expected);

            done();
        });

        it('does not add a hint when provided path is invalid', (done) => {
            let globals = {resourceHints: []};
            sandbox.spy(globals.resourceHints, 'push');

            [undefined, null, ''].map(s => {
                ResourceHints.addResourceHint(
                    global,
                    s,
                    ResourceHints.defaultResourceHintSate,
                    ResourceHints.resourceHintAllowedTypes.resourceHintStyleType
                );
            });

            expect(globals.resourceHints.push.notCalled).to.equals(true);

            done();
        });

        it('does create a hint when no type is provided', (done) => {
            let globals = {resourceHints: []};
            sandbox.spy(globals.resourceHints, 'push');

            ResourceHints.addResourceHint(
                globals,
                'https://my.asset.css',
                ResourceHints.defaultResourceHintSate
            );

            expect(globals.resourceHints.push.calledOnce).to.equals(true);
            let hint = _.head(globals.resourceHints);
            expect(hint.type).to.not.exist();

            done();
        });

        it('does not create a hint when provided state param is not supported', (done) => {
            let globals = {resourceHints: []};
            sandbox.spy(globals.resourceHints, 'push');

            ResourceHints.addResourceHint(
                globals,
                '/styles.css',
                'not-supported'
            );

            expect(globals.resourceHints.push.notCalled).to.equals(true);

            done();
        });

        it('does not create duplicate, by src, hints', (done) => {
            let globals = {resourceHints: []};
            sandbox.spy(globals.resourceHints, 'push');

            let src = '/my/styles.css';
            let type = 'style';
            let state = 'preload';

            for (let i = 0; i < 5; i++) {
                ResourceHints.addResourceHint(
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
            let filled = _.fill(Array(50), 1);
            let globals = {resourceHints: filled};
            sandbox.spy(globals.resourceHints, 'push');

            ResourceHints.addResourceHint(
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
