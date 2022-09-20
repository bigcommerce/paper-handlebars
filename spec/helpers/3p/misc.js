const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe

const { buildRenderer } = require('../../spec-helpers');
const renderer = buildRenderer();
const hbs = renderer.handlebars;
const helpers = require('../../../helpers/3p/misc');

Object.keys(helpers).forEach(key => {
    hbs.registerHelper(key, helpers[key]);
});


describe('misc', function() {
    describe('default', function() {
        it('should use the given value:', function(done) {
            expect(hbs.compile('{{default title "A"}}')({title: 'B'})).to.equal('B');
            done();
        });
        it('should fallback to the default value when no value exists', function(done) {
            expect(hbs.compile('{{default title "A"}}')({title: null})).to.equal('A');
            expect(hbs.compile('{{default title "A"}}')()).to.equal('A');
            done();
        });
    });

    describe('noop', function() {
        it('should be a noop', function(done) {
            var fn = hbs.compile('{{#noop}}{{message}}{{/noop}}');
            expect(fn({message: 'This is a test'})).to.equal('This is a test');
            done();
        });
    });

    describe('withHash', function() {
        it('should return an empty sting', function(done) {
            var fn = hbs.compile('{{#withHash}}{{message}}{{/withHash}}');
            var actual = fn({message: 'This is a test'});
            expect(typeof actual).to.equal('string');
            expect(actual).to.equal('');
            done();
        });
        it('should not blow up when no hash is defined.', function(done) {
            var fn = hbs.compile('{{#withHash}}{{/withHash}}');
            expect(fn()).to.equal('');
            done();
        });
        it('should return the inverse hash when defined and the value is falsy.', function(done) {
            var fn = hbs.compile('{{#withHash}}foo{{else}}bar{{/withHash}}');
            expect(fn()).to.equal('bar');
            done();
        });
        it('should return string from the newly created context', function(done) {
            var fn = hbs.compile('{{#withHash message="test"}}{{message}}{{/withHash}}');
            expect(fn({message: 'This is a test'})).to.equal('test');
            done();
        });
        it('should return string from the parent context', function(done) {
            var fn = hbs.compile('{{#withHash message=this.message}}{{message}}{{/withHash}}');
            expect(fn({message: 'This is a test'})).to.equal('This is a test');
            done();
        });
        it('should add two attributes to the new context', function(done) {
            var fn = hbs.compile('{{#withHash subject="Feedback" message="Hello!"}}{{subject}} - {{message}}{{/withHash}}');
            expect(fn({})).to.equal('Feedback - Hello!');
            done();
        });
    });
});