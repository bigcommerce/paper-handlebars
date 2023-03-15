/**
 * https://github.com/helpers/handlebars-helpers/blob/0.8.4/test/array.js
 */

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe

const {buildRenderer} = require('../spec-helpers');
const renderer = buildRenderer();
const hbs = renderer.handlebars;
const helpers = require('../../helpers/last');

Object.keys(helpers).forEach(key => {
    hbs.registerHelper(key, helpers[key]);
})


describe('last', function () {

    describe('string', function () {
        const context = {
            myString: 'BigCommerce',
            emptyString: '',
            smallString: 'abc'
        };

        it('should return an empty string when empty string is provided.', function (done) {
            expect(hbs.compile('{{last emptyString}}')(context)).to.equal('');
            expect(hbs.compile('{{last emptyString 2}}')(context)).to.equal('');
            done();
        });

        it('should return the whole string when the number is big enough.', function (done) {
            expect(hbs.compile('{{last smallString 5}}')(context)).to.equal('abc');
            done();
        });

        it('should return the expected substring.', function (done) {
            expect(hbs.compile('{{last myString 5}}')(context)).to.equal('merce');
            done();
        });

    });

    describe('array', function () {
        const context = {
            array: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            notArray: null,
        };

        it('should return an empty string when undefined.', function (done) {
            expect(hbs.compile('{{last}}')()).to.equal('');
            done();
        });

        it('should return the last item in an array.', function (done) {
            expect(hbs.compile('{{last array}}')(context)).to.equal('h');
            done();
        });

        it('should return an array with the last two items in an array.', function (done) {
            expect(hbs.compile('{{last array 2}}')(context)).to.equal(['g', 'h'].toString());
            done();
        });

        it('should return an empty array array if non array is passed', function (done) {
            expect(hbs.compile('{{last notArray 2}}')(context)).to.equal([].toString());
            done();
        });
    });
});
