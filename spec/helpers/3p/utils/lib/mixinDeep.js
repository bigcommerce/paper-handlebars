const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;

var mixinDeep = require('../../../../../helpers/3p/utils/lib/mixinDeep');


describe('.mixinDeep()', function() {
  it('should deeply mix the properties of object into the first object.', function(done) {
    var a = mixinDeep({a: {aa: 'aa'} }, {a: {bb: 'bb'} }, {a: {cc: 'cc'} }); 
    expect(a).to.equal({a: {aa: 'aa', bb: 'bb', cc: 'cc'} });
    var b = mixinDeep({a: {aa: 'aa', dd: {ee: 'ff'} } }, {a: {bb: 'bb', dd: {gg: 'hh'} } }, {a: {cc: 'cc', dd: {ii: 'jj'} } });
    expect(b).to.equal({a: {aa: 'aa', dd: {ee: 'ff', gg: 'hh', ii: 'jj'}, bb: 'bb', cc: 'cc'} });
    done();
  });

  it('should merge object properties without affecting any object', function(done) {
    var obj1 = {a: 0, b: 1};
    var obj2 = {c: 2, d: 3};
    var obj3 = {a: 4, d: 5};

    var actual = {a: 4, b: 1, c: 2, d: 5 };

    expect(mixinDeep({}, obj1, obj2, obj3)).to.equal(actual);
    expect(actual).to.not.equal(obj1);
    expect(actual).to.not.equal(obj2);
    expect(actual).to.not.equal(obj3);
    done();
  });

  it('should do a deep merge', function(done) {
    var obj1 = {a: {b: 1, c: 1, d: {e: 1, f: 1}}};
    var obj2 = {a: {b: 2, d : {f : 'f'} }};

    expect(mixinDeep(obj1, obj2)).to.equal({a: {b: 2, c: 1, d: {e: 1, f: 'f'} }});
    done();
  });

  it('should use the last value defined', function(done) {
    var obj1 = {a: 'b'};
    var obj2 = {a: 'c'};

    expect(mixinDeep(obj1, obj2)).to.equal({a: 'c'});
    done();
  });

  it('should use the last value defined on nested object', function(done) {
    var obj1 = {a: 'b', c: {d: 'e'}};
    var obj2 = {a: 'c', c: {d: 'f'}};

    expect(mixinDeep(obj1, obj2)).to.equal({a: 'c', c: {d: 'f'}});
    done();
  });

  it('should shallow clone when an empty object is passed', function(done) {
    var obj1 = {a: 'b', c: {d: 'e'}};
    var obj2 = {a: 'c', c: {d: 'f'}};

    var res = mixinDeep({}, obj1, obj2);
    expect(res).to.equal({a: 'c', c: {d: 'f'}});
    done();
  });

  it('should merge additional objects into the first:', function(done) {
    var obj1 = {a: {b: 1, c: 1, d: {e: 1, f: 1}}};
    var obj2 = {a: {b: 2, d : {f : 'f'} }};

    mixinDeep(obj1, obj2);
    expect(obj1).to.equal({a: {b: 2, c: 1, d: {e: 1, f: 'f'} }});
    done();
  });

  it('should clone objects during merge', function(done) {
    var obj1 = {a: {b :1}};
    var obj2 = {a: {c :2}};

    var actual = mixinDeep({}, obj1, obj2);
    expect(actual).to.equal({a:{b:1, c:2}});
    expect(actual.a).to.equal(obj1.a);
    expect(actual.a).to.not.equal(obj2.a);
    done();
  });

  it('should deep clone arrays during merge', function(done) {
    var obj1 = {a: [1, 2, [3, 4]]};
    var obj2 = {b : [5, 6]};

    var actual = mixinDeep(obj1, obj2);
    expect(actual.a).to.equal([1, 2, [3, 4]]);
    expect(actual.a[2]).to.equal([3, 4]);
    expect(actual.b).to.equal(obj2.b);
    done();
  });

  it('should copy source properties', function(done) {
    expect(mixinDeep({ test: true }).test).to.equal(true);
    done();
  });

  it('should not clone arrays', function(done) {
    expect(mixinDeep([1, 2, 3])).to.equal([1, 2, 3]);
    expect(mixinDeep([1, 2, 3], {})).to.equal([1, 2, 3]);
    done();
  });

  it('should work with sparse objects:', function(done) {
    var actual = mixinDeep({}, undefined, {a: 'b'}, undefined, {c: 'd'});
    expect(actual).to.equal({a: 'b', c: 'd'});
    done();
  });

  it('should clone RegExps', function(done) {
    var fixture = /test/g;
    var actual = mixinDeep(fixture);
    expect(actual).to.equal(fixture);
    done();
  });

  it('should clone Dates', function(done) {
    var fixture = new Date();
    var actual = mixinDeep(fixture);
    expect(actual).to.equal(fixture);
    done();
  });

  it('should not clone objects created with custom constructor', function(done) {
    function TestType() { }
    var fixture = new TestType();
    var actual = mixinDeep(fixture);
    expect(actual).to.equal(fixture);
    done();
  });
});