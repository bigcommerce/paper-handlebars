const Code = require('code'),
    expect = Code.expect;
const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it;
const {
    addResourceHint,
    defaultResourceHintState,
    resourceHintAllowedTypes
} = require('../../../helpers/lib/resourceHints');

describe('resource hints', function () {

    describe('addResourceHint', function () {

        it("creates resource hints when valid params are provided", (done) => {
            const globals = { resourceHints: [] };

            const src = '/my/styles.css';
            const type = 'style';
            const state = 'preload';
            const cors = 'anonymous';
            const expected = { src, state, type, cors };

            addResourceHint(globals, src, state, type, cors);

            expect(globals.resourceHints).to.have.length(1);
            expect(globals.resourceHints[0]).to.equals(expected);

            done();
        });

        it("creates resource hints when valid params are provided defaulting cors to no when no provided", (done) => {
            const globals = {};

            const src = '/my/styles.css';
            const type = 'style';
            const state = 'preload';
            const expected = { src, state, type, cors: 'no' };

            addResourceHint(globals, src, state, type);

            expect(globals.resourceHints).to.have.length(1);
            expect(globals.resourceHints[0]).to.equals(expected);

            done();
        });

        it('does not add a hint when provided path is invalid', (done) => {
            const globals = { resourceHints: [] };

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

            expect(globals.resourceHints).to.have.length(0);

            done();
        });

        it('does create a hint when no type is provided', (done) => {
            const globals = { resourceHints: [] };

            addResourceHint(
                globals,
                'https://my.asset.css',
                defaultResourceHintState
            );

            expect(globals.resourceHints).to.have.length(1);
            expect(globals.resourceHints[0].type).to.not.exist();

            done();
        });

        it('does not create a hint when provided state param is not supported', (done) => {
            const globals = { resourceHints: [] };

            const f = () => addResourceHint(
                globals,
                '/styles.css',
                'not-supported'
            );

            expect(f).to.throw();

            done();
        });

        it('does not create duplicate, by src, hints', (done) => {
            const globals = { resourceHints: [] };

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

            expect(globals.resourceHints).to.have.length(1);

            done();
        });

        it('does not create any hint when the limit of allowed hints was reached', (done) => {
            const filled = Array(50).fill(1);
            const globals = { resourceHints: filled };

            addResourceHint(
                globals,
                '/my/styles.css',
                'preload',
                'style'
            );

            expect(globals.resourceHints).to.have.length(filled.length);

            done();
        });

        it('should throw when invalid cors value is provided', done => {
            const f = () => addResourceHint({}, '/theme.css', 'style', 'preload', 'invalid-cors');
            expect(f).to.throw();
            done();
        });

        it('should url with special chars', done => {
            const data = [{
                original: "https://bigcommerce.paystackintegrations.com/js/script.js?store_hash=cag1k6vhir&installed_at=Tue May 10 2022 08:57:26 GMT+0000 (Coordinated Universal Time)",
                expected: "https://bigcommerce.paystackintegrations.com/js/script.js?store_hash=cag1k6vhir&installed_at=Tue%20May%2010%202022%2008:57:26%20GMT+0000%20(Coordinated%20Universal%20Time)"
            },
            {
                original: `https://instocknotify.blob.core.windows.net/stencil/cfa17df4-72e5-4c23-a4c7-1fa6903bdeb4.js?ts=17443383" type="text/javascript""`,
                expected: "https://instocknotify.blob.core.windows.net/stencil/cfa17df4-72e5-4c23-a4c7-1fa6903bdeb4.js?ts=17443383%22%20type=%22text/javascript%22%22"
            },
            {
                original: `https://instocknotify.blob.core.windows.net/stencil/41f9521c-57b6-4920-827b-77ba3477fcb5.js?ts=34911865" type="text/javascript"></script> <!--End InStockNotify Stencil Script -->`,
                expected: "https://instocknotify.blob.core.windows.net/stencil/41f9521c-57b6-4920-827b-77ba3477fcb5.js?ts=34911865%22%20type=%22text/javascript%22%3E%3C/script%3E%20%3C!--End%20InStockNotify%20Stencil%20Script%20--%3E"
            },
            {
                original: `https://fonts.googleapis.com/css?family=Karla:400|Montserrat:400,500,700&display=block`,
                expected: `https://fonts.googleapis.com/css?family=Karla:400%7CMontserrat:400,500,700&display=block`
            }];
            const globals = { resourceHints: [] };

            data.forEach(pair => {
                const {original, expected} = pair;

                const type = 'style';
                const state = 'preload';
                const cors = 'anonymous';

                expect(
                    expected,
                    addResourceHint(globals, original, state, type, cors)
                );
            });
            done();
        });
    });
});
