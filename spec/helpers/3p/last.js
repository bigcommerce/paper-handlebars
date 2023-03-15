const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it;
const {testRunner} = require("../../spec-helpers");

describe('last', () => {
    describe('string', () => {

        const context = {
            smallString: 'abc',
            empty: '',
            myString: 'BigCommerce'
        };

        const runner = testRunner({context});

        it('should extract the last char when no "n" is given.', done => {
            runner([{
                input: '{{last myString}}',
                output: 'e'
            }], done);
        });

        it('should return the whole string when "n" is bigger that string size', done => {
            runner([{
                input: '{{last smallString 5}}',
                output: context.smallString
            }], done);
        });

        it('should return the expected string', done => {
            runner([{
                input: '{{last myString 3}}',
                output: 'rce'
            }], done);
        });

        it('should return empty string when empty string is provided', done => {
            runner([{
                input: '{{last empty 3}}',
                output: ''
            }], done);
        });
    });

    describe('array', () => {

        const context = {
            small: [1, 2, 3],
            empty: [],
            arrayYay: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
        };

        const runner = testRunner({context});

        it('should extract the last elem when no "n" is given.', done => {
            runner([{
                input: '{{last arrayYay}}',
                output: '0'
            }], done);
        });

        it('should return the whole array when "n" is bigger that array size', done => {
            runner([{
                input: '{{last small 5}}',
                output: context.small.join()
            }], done);
        });

        it('should return the expected elems', done => {
            runner([{
                input: '{{last arrayYay 3}}',
                output: [8, 9, 0].join()
            }], done);
        });

        it('should return empty string when empty array is provided', done => {
            runner([{
                input: '{{last empty 3}}',
                output: ''
            }], done);
        });
    });
});