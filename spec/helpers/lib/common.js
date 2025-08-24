const getValue = require('../../../helpers/lib/common').getValue;
const appendLossyParam = require('../../../helpers/lib/common').appendLossyParam;
const Code = require('code'),
      expect = Code.expect;
const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it;
const Handlebars = require('handlebars');

describe('common utils', function () {
    describe('getValue', function () {
        const globals = {handlebars: Handlebars};
        const obj = {
            a: {
                a: [{x: 'a'}, {y: 'b'}],
                b: {
                    b: {
                        a: 1,
                    },
                },
                c: [1, 1, 2, 3, 5, 8, 13, 21, 34],
            },
            b: [2, 3, 5, 7, 11, 13, 17, 19],
            c: 3,
            d: false,
            '42': 42,
        };
        obj.__proto__ = {x: 'yz'};

        it('should get a value from an object', (done) => {
            expect(getValue(obj, 'c', globals)).to.equal(3);
            expect(getValue(obj, 'd', globals)).to.equal(false);
            done();
        });

        it('should get nested values', (done) => {
            expect(getValue(obj, 'a.b.b.a', globals)).to.equal(1);
            expect(getValue(obj, ['a', 'b', 'b', 'a'], globals)).to.equal(1);
            done();
        });

        it('should get nested values from arrays', (done) => {
            expect(getValue(obj, 'b.0', globals)).to.equal(2);
            expect(getValue(obj, 'a.c.5', globals)).to.equal(8);
            done();
        });

        it('should get nested values from objects in arrays', (done) => {
            expect(getValue(obj, 'a.a.1.y', globals)).to.equal('b');
            done();
        });

        it('should return obj[String(path)] or undefined if path is not a string or array', (done) => {
            expect(getValue(obj, {a: 1}, globals)).to.equal(undefined);
            expect(getValue(obj, ()=>1, globals)).to.equal(undefined);
            expect(getValue(obj, 42, globals)).to.equal(42);
            done();
        });

        it('should return the whole object if path is empty', (done) => {
            expect(getValue(obj, [], globals)).to.equal(obj);
            done();
        });

        it('should return obj if path is falsey', (done) => {
            expect(getValue(obj, '', globals)).to.equal(obj);
            expect(getValue(obj, false, globals)).to.equal(obj);
            expect(getValue(obj, 0, globals)).to.equal(obj);
            done();
        });

        it('should return undefined if prop does not exist', (done) => {
            expect(getValue(obj, 'a.a.a.a', globals)).to.equal(undefined);
            expect(getValue(obj, 'a.c.23', globals)).to.equal(undefined);
            expect(getValue(obj, 'ab', globals)).to.equal(undefined);
            expect(getValue(obj, 'nonexistent', globals)).to.equal(undefined);
            expect(getValue([ undefined ], '0.x', globals)).to.equal(undefined);
            expect(getValue([ null ], '0.x', globals)).to.equal(undefined);
            done();
        });

        it('should treat backslash-escaped . characters as part of a prop name', (done) => {
            const data = {'a.b': {'c.d.e': 42, z: 'xyz'}};

            expect(getValue(data, 'a\\.b.z', globals)).to.equal('xyz');
            expect(getValue(data, 'a\\.b.c\\.d\\.e', globals)).to.equal(42);
            done()
        });

        it('should not access inherited props', (done) => {
            expect(getValue(obj, 'x', globals)).to.equal(undefined);
            expect(getValue(obj, 'a.constructor', globals)).to.equal(undefined);
            done();
        });
    });

    describe('appendLossyParam', function() {
        it('should append compression=lossy to URLs without query params', function(done) {
            const result = appendLossyParam('https://example.com/image.jpg', true);
            expect(result).to.equal('https://example.com/image.jpg?compression=lossy');
            done();
        });

        it('should append compression=lossy to URLs with existing query params', function(done) {
            const result = appendLossyParam('https://example.com/image.jpg?c=2', true);
            expect(result).to.equal('https://example.com/image.jpg?c=2&compression=lossy');
            done();
        });

        it('should not modify URL when lossy is false', function(done) {
            const url = 'https://example.com/image.jpg?c=2';
            const result = appendLossyParam(url, false);
            expect(result).to.equal(url);
            done();
        });

        it('should not modify URL when lossy is undefined', function(done) {
            const url = 'https://example.com/image.jpg';
            const result = appendLossyParam(url);
            expect(result).to.equal(url);
            done();
        });

        it('should not modify URL when lossy is not a boolean', function(done) {
            const url = 'https://example.com/image.jpg';
            const result = appendLossyParam(url, 'true');
            expect(result).to.equal(url);
            done();
        });
    });
});