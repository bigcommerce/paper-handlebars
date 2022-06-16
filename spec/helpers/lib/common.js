const getValue = require('../../../helpers/lib/common').getValue;
const Code = require('code'),
      expect = Code.expect;
const Lab = require('lab'),
      lab = exports.lab = Lab.script(),
      describe = lab.experiment,
      it = lab.it;

describe('common utils', function () {
    describe('getValue', function () {
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
        };
        obj.__proto__ = {x: 'yz'};

        it('should get a value from an object', (done) => {
            expect(getValue(obj, 'c')).to.equal(3);
            expect(getValue(obj, 'd')).to.equal(false);
            done();
        });

        it('should get nested values', (done) => {
            expect(getValue(obj, 'a.b.b.a')).to.equal(1);
            expect(getValue(obj, ['a', 'b', 'b', 'a'])).to.equal(1);
            done();
        });

        it('should get nested values from arrays', (done) => {
            expect(getValue(obj, 'b.0')).to.equal(2);
            expect(getValue(obj, 'a.c.5')).to.equal(8);
            done();
        });

        it('should get nested values from objects in arrays', (done) => {
            expect(getValue(obj, 'a.a.1.y')).to.equal('b');
            done();
        });

        it('should return the whole object if path is not a string or array', (done) => {
            expect(getValue(obj, {})).to.equal(obj);
            expect(getValue(obj)).to.equal(obj);
            done();
        });

        it('should return the whole object if path is empty', (done) => {
            expect(getValue(obj, '')).to.equal(obj);
            expect(getValue(obj, [])).to.equal(obj);
            done();
        });

        it('should return undefined if prop does not exist', (done) => {
            expect(getValue(obj, 'a.a.a.a')).to.equal(undefined);
            expect(getValue(obj, 'a.c.23')).to.equal(undefined);
            expect(getValue(obj, 'ab')).to.equal(undefined);
            expect(getValue(obj, 'nonexistent')).to.equal(undefined);
            done();
        });

        it('should treat backslash-escaped . characters as part of a prop name', (done) => {
            const data = {'a.b': {'c.d.e': 42, z: 'xyz'}};

            expect(getValue(data, 'a\\.b.z')).to.equal('xyz');
            expect(getValue(data, 'a\\.b.c\\.d\\.e')).to.equal(42);
            done()
        });

        it('should not access inherited props', (done) => {
            expect(getValue(obj, 'x')).to.equal(undefined);
            expect(getValue(obj, 'a.constructor')).to.equal(undefined);
            done();
        });
    });
});