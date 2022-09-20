const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;
const it = lab.it;
const describe = lab.describe;

const striptags = require('../../../../../helpers/3p/utils/lib/striptags');

describe('striptags', function() {
    it('should not modify plain text', function(done) {
        var text = 'lorem ipsum < a>';

        expect(striptags(text)).to.equal(text);
        done();
    });

    it('should remove simple HTML tags', function(done) {
        var html = '<a href="">lorem <strong>ipsum</strong></a>',
            text = 'lorem ipsum';

        expect(striptags(html)).to.equal(text);
        done();
    });

    it('should leave HTML tags if specified', function(done) {
        var html = '<strong>lorem ipsum</strong>',
            allowedTags = '<strong>';

        expect(striptags(html, allowedTags)).to.equal(html);
        done();
    });

    it('should leave attributes when allowing HTML', function(done) {
        var html = '<a href="https://example.com">lorem ipsum</a>',
            allowedTags = '<a>';

        expect(striptags(html, allowedTags)).to.equal(html);
        done();
    });

    it('should leave nested HTML tags if specified', function(done) {
        var html = '<div>lorem <strong>ipsum</strong></div>',
            strippedHtml = 'lorem <strong>ipsum</strong>',
            allowedTags = '<strong>';

        expect(striptags(html, allowedTags)).to.equal(strippedHtml);
        done();
    });

    it('should leave outer HTML tags if specified', function(done) {
        var html = '<div>lorem <strong>ipsum</strong></div>',
            strippedHtml = '<div>lorem ipsum</div>',
            allowedTags = '<div>';

        expect(striptags(html, allowedTags)).to.equal(strippedHtml);
        done();
    });

    it('should remove DOCTYPE declaration', function(done) {
        var html = '<!DOCTYPE html> lorem ipsum',
            text = ' lorem ipsum';

        expect(striptags(html)).to.equal(text);
        done();
    });

    it('should remove comments', function(done) {
        var html = '<!-- lorem ipsum --> dolor sit amet',
            text = ' dolor sit amet';

        expect(striptags(html)).to.equal(text);
        done();
    });

    it('should strip <> within quotes', function(done) {
        var html = '<a href="<script>">lorem ipsum</a>',
            strippedHtml = '<a href="script">lorem ipsum</a>',
            allowedTags = '<a>';

        expect(striptags(html, allowedTags)).to.equal(strippedHtml);
        done();
    });

    it('should strip extra < within tags', function(done) {
        var html = '<div<>>lorem ipsum</div>',
            strippedHtml = '<div>lorem ipsum</div>',
            allowedTags = '<div>';

        expect(striptags(html, allowedTags)).to.equal(strippedHtml);
        done();
    });

    it('should strip tags within comments', function(done) {
        var html = '<!-- <strong>lorem ipsum</strong> --> dolor sit',
            text = ' dolor sit';

        expect(striptags(html)).to.equal(text);
        done();
    });

    it('should strip comment-like tags', function(done) {
        var html = '<! lorem ipsum> dolor sit',
            text = ' dolor sit';

        expect(striptags(html)).to.equal(text);
        done();
    });

    it('should leave normal exclamation points alone', function(done) {
        var text = 'lorem ipsum! dolor sit amet';

        expect(striptags(text)).to.equal(text);
        done();
    });

    it('should allow an array parameter for allowable tags', function(done) {
        var html = '<strong>lorem <em>ipsum</em></strong>',
            allowedTags = ['strong', 'em'];

        expect(striptags(html, allowedTags)).to.equal(html);
        done();
    });

    it('should strip tags when an empty array is provided', function(done) {
        var html = '<article>lorem <a href="#">ipsum</a></article>',
            allowedTags = [],
            text = 'lorem ipsum';

        expect(striptags(html, allowedTags)).to.equal(text);
        done();
    });

    it('should not fail with nested quotes', function(done) {
        var html = '<article attr="foo \'bar\'">lorem</article> ipsum',
            allowedTags = [],
            text = 'lorem ipsum';

        expect(striptags(html, allowedTags)).to.equal(text);
        done();
    });
});