const getValue = require('../../../helpers/lib/common').getValue;
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
            expect(getValue(globals, obj, 'c')).to.equal(3);
            expect(getValue(globals, obj, 'd')).to.equal(false);
            done();
        });

        it('should get nested values', (done) => {
            expect(getValue(globals, obj, 'a.b.b.a')).to.equal(1);
            expect(getValue(globals, obj, ['a', 'b', 'b', 'a'])).to.equal(1);
            done();
        });

        it('should get nested values from arrays', (done) => {
            expect(getValue(globals, obj, 'b.0')).to.equal(2);
            expect(getValue(globals, obj, 'a.c.5')).to.equal(8);
            done();
        });

        it('should get nested values from objects in arrays', (done) => {
            expect(getValue(globals, obj, 'a.a.1.y')).to.equal('b');
            done();
        });

        it('should return obj[String(path)] or undefined if path is not a string or array', (done) => {
            expect(getValue(globals, obj, {a: 1})).to.equal(undefined);
            expect(getValue(globals, obj, ()=>1)).to.equal(undefined);
            expect(getValue(globals, obj, 42)).to.equal(42);
            done();
        });

        it('should return the whole object if path is empty', (done) => {
            expect(getValue(globals, obj, [])).to.equal(obj);
            done();
        });

        it('should return obj if path is falsey', (done) => {
            expect(getValue(globals, obj, '')).to.equal(obj);
            expect(getValue(globals, obj, false)).to.equal(obj);
            expect(getValue(globals, obj, 0)).to.equal(obj);
            done();
        });

        it('should return undefined if prop does not exist', (done) => {
            expect(getValue(globals, obj, 'a.a.a.a')).to.equal(undefined);
            expect(getValue(globals, obj, 'a.c.23')).to.equal(undefined);
            expect(getValue(globals, obj, 'ab')).to.equal(undefined);
            expect(getValue(globals, obj, 'nonexistent')).to.equal(undefined);
            expect(getValue(globals, [ undefined ], '0.x')).to.equal(undefined);
            expect(getValue(globals, [ null ], '0.x')).to.equal(undefined);
            done();
        });

        it('should treat backslash-escaped . characters as part of a prop name', (done) => {
            const data = {'a.b': {'c.d.e': 42, z: 'xyz'}};

            expect(getValue(globals, data, 'a\\.b.z')).to.equal('xyz');
            expect(getValue(globals, data, 'a\\.b.c\\.d\\.e')).to.equal(42);
            done()
        });

        it('should not access inherited props', (done) => {
            expect(getValue(globals, obj, 'x')).to.equal(undefined);
            expect(getValue(globals, obj, 'a.constructor')).to.equal(undefined);
            done();
        });
    });
});