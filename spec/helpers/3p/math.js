const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe

const { buildRenderer } = require('../../spec-helpers');
const renderer = buildRenderer();
const hbs = renderer.handlebars;
const helpers = require('../../../helpers/3p/math');

Object.keys(helpers).forEach(key => {
    hbs.registerHelper(key, helpers[key]);
});
describe('math', function() {
  describe('add', function() {
    it('should return the sum of two numbers.', function(done) {
      var fn = hbs.compile('{{add value 5}}');
      expect(fn({value: 5})).to.equal('10');
      done();
    });
  });

  describe('average', function() {
    it('should return the average of a list of numbers:', function(done) {
      var fn = hbs.compile('{{avg 1 2 3 4}}');
      expect(fn()).to.equal('2.5');
      done();
    });

    it('should return the average of an array of numbers:', function(done) {
      var fn = hbs.compile('{{avg array}}');
      expect(fn({array: [1, 3, 6, 9]})).to.equal('4.75');
      done();
    });
  });
  
  describe('ceil', function() {
    it('should return the value rounded up to the nearest integer.', function(done) {
      var fn = hbs.compile('{{ceil value}}');
      expect(fn({value: 5.6})).to.equal('6');
      done();
    });
  });

  describe('divide', function() {
    it('should return the division of two numbers.', function(done) {
      var fn = hbs.compile('{{divide value 5}}');
      expect(fn({value: 5})).to.equal('1');
      done();
    });
  });

  describe('floor', function() {
    it('should return the value rounded down to the nearest integer.', function(done) {
      var fn = hbs.compile('{{floor value}}');
      expect(fn({value: 5.6})).to.equal('5');
      done();
    });
  });

  describe('multiply', function() {
    it('should return the multiplication of two numbers.', function(done) {
      var fn = hbs.compile('{{multiply value 5}}');
      expect(fn({value: 5})).to.equal('25');
      done();
    });
  });

  describe('round', function() {
    it('should return the value rounded to the nearest integer.', function(done) {
      var fn = hbs.compile('{{round value}}');
      expect(fn({value: 5.69})).to.equal('6');
      done();
    });
  });

  describe('subtract', function() {
    it('should return the difference of two numbers.', function(done) {
      var fn = hbs.compile('{{subtract value 5}}');
      expect(fn({value: 5})).to.equal('0');
      done();
    });
  });

  describe('sum', function() {
    it('should return the sum of multiple numbers.', function(done) {
      var fn = hbs.compile('{{sum value 67 80}}');
      expect(fn({value: 20})).to.equal('167');
      done();
    });
    it('should return the sum of multiple numbers.', function(done) {
      var fn = hbs.compile('{{sum 1 2 3}}');
      expect(fn()).to.equal('6');
      done();
    });
    it('should return the total sum of array.', function(done) {
      var fn = hbs.compile('{{sum value}}');
      expect(fn({value: [1, 2, 3]})).to.equal('6');
      done();
    });
    it('should return the total sum of array and numbers.', function(done) {
      var fn = hbs.compile('{{sum value 5}}');
      expect(fn({value: [1, 2, 3]})).to.equal('11');
      done();
    });
  });
});