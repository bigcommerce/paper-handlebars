const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe

const { buildRenderer } = require('../../spec-helpers');
const renderer = buildRenderer();
const hbs = renderer.handlebars;


describe('number', function() {
  describe('phoneNumber', function() {
    it('Format a phone number.', function(done) {
      var fn = hbs.compile('{{phoneNumber value}}');
      expect(fn({value: '8005551212'})).to.equal('(800) 555-1212');
      done();
    });
  });

  describe('toFixed', function() {
    it('should return the value rounded to the nearest integer.', function(done) {
      var fn = hbs.compile('{{toFixed value}}');
      expect(fn({value: 5.53231 })).to.equal('6');
      done();
    });
    it('should return the value rounded exactly n digits after the decimal place.', function(done) {
      var fn = hbs.compile('{{toFixed value 3}}');
      expect(fn({value: 5.53231 })).to.equal('5.532');
      done();
    });
  });

  describe('toPrecision', function() {
    it('Returns the number in fixed-point or exponential notation rounded to n significant digits.', function(done) {
      var fn = hbs.compile('{{toPrecision value}}');
      expect(fn({value: 555.322 })).to.equal('6e+2');
      done();
    });
    it('should return the value rounded exactly n digits after the decimal place.', function(done) {
      var fn = hbs.compile('{{toPrecision value 4}}');
      expect(fn({value: 555.322 })).to.equal('555.3');
      done();
    });
  });

  describe('toExponential', function() {
    it('should return the number in fixed-point or exponential notation rounded to n significant digits.', function(done) {
      var fn = hbs.compile('{{toExponential value}}');
      expect(fn({value: 5 })).to.equal('5e+0');
      done();
    });
    it('should return the number in fixed-point or exponential notation rounded to exactly n significant digits.', function(done) {
      var fn = hbs.compile('{{toExponential value 5}}');
      expect(fn({value: 5 })).to.equal('5.00000e+0');
      done();
    });
  });

  describe('toInt', function() {
    it('should return an integer.', function(done) {
      var fn = hbs.compile('{{toInt value}}');
      expect(fn({value: '3cc'})).to.equal('3');
      done();
    });
  });

  describe('toFloat', function() {
    it('should return a floating point number.', function(done) {
      var fn = hbs.compile('{{toFloat value}}');
      expect(fn({value: '3.1cc'})).to.equal('3.1');
      done();
    });
  });

  describe('addCommas', function() {
    it('should add commas to a number.', function(done) {
      var fn = hbs.compile('{{addCommas value}}');
      expect(fn({value: 2222222 })).to.equal('2,222,222');
      done();
    });
  });

  describe('toAbbr', function() {
    it('should abbreviate the given number.', function(done) {
      var fn = hbs.compile('{{toAbbr number}}');
      expect(fn({number: 123456789 })).to.equal('123.46m');
      done();
    });

    it('should abbreviate a number with to the given decimal.', function(done) {
      var fn = hbs.compile('{{toAbbr number 3}}');
      expect(fn({number: 123456789 })).to.equal('123.457m');
      done();
    });

    it('should round up to the next increment', function(done) {
      var fn = hbs.compile('{{toAbbr number}}');
      expect(fn({number: 999 })).to.equal('1k');
      done();
    });

    it('should abbreviate a number based on a number and include decimal.', function(done) {
      expect(hbs.compile('{{toAbbr number 0}}')({number: 9999999 })).to.equal('10m');
      expect(hbs.compile('{{toAbbr number}}')({number: 1000000000 })).to.equal('1b');
      expect(hbs.compile('{{toAbbr number}}')({number: 1000000000000 })).to.equal('1t');
      expect(hbs.compile('{{toAbbr number}}')({number: 1000000000000000 })).to.equal('1q');
      expect(hbs.compile('{{toAbbr number}}')({number: 99393999393 })).to.equal('99.39b');
      done();
    });
  });

  describe('random', function() {
    it('should return a random number between two values.', function(done) {
      var fn = hbs.compile('{{random 5 10}}');
      expect(fn()).to.be.within(5,10);
      done();
    });
  });
});