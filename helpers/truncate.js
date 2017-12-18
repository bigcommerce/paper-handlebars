'use strict';

const substring = require('stringz').substring;

/* 2017-02-14
 *
 * FUNCTION
 * truncate(str, length)
 *
 * DESCRIPTION (WHAT)
 * Returns the first X characters in a string (unless it reaches the end
 * of the string first, in which case it will return fewer). Returns a
 * new string that is truncated to the given length.
 *
 * USE CASE (WHY)
 * As a merchant, I want to display a card, at the bottom of
 * my home page that highlights the most recent blog post. In the card,
 * I want to display the blog thumbnail, title and the first 40 characters
 * of the post's body. In order to extract the first 40 characters, I need
 * a Handlebars helper that works like the javascript substring() function.
 *
 * USAGE
 *
 *  {{lang (truncate 'blog.post.body.' 40) }}
 */
const factory = globals => {
    return function(string, length) {
        if (typeof string !== 'string') {
            return string;
        }

        const truncatedString = substring(string, 0, length);

        return new globals.handlebars.SafeString(truncatedString);
    };
};

module.exports = [{
    name: 'truncate',
    factory: factory,
}];
