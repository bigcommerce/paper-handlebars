'use strict';

const utils = require('./utils');
const striptags = require('./utils/lib/striptags');

function parseAttributes(hash) {
  return Object.keys(hash).map(function (key) {
    return key + '="' + hash[key] + '"';
  }).join(' ');
};

function sanitize(str) {
  if (!utils.isString(str)) { return ''; }
  return striptags(str).trim();
};

/**
 * Truncate a string by removing all HTML tags and limiting the result
 * to the specified `length`. Aslo see [ellipsis](#ellipsis).
 *
 * ```js
 * truncate("<span>foo bar baz</span>", 7);
 * //=> 'foo bar'
 * ```
 *
 * @name .truncate
 * @param  {String} `str`
 * @param  {Number} `limit` The desired length of the returned string.
 * @param  {String} `suffix` Optionally supply a string to use as a suffix to
 * denote when the string has been truncated.
 * @return {String} The truncated string.
 * @api public
 */
function truncate(str, limit, suffix) {
  if (str && typeof str === 'string') {
    var ch = typeof suffix === 'string' ? suffix : '';
    if (str.length > limit) {
      return sanitize(str).slice(0, limit - ch.length) + ch;
    }
    return str;
  }
};

/**
 * Expose `helpers`
 */

var helpers = module.exports;

/**
 * Truncates a string to the specified `length`, and appends
 * it with an elipsis, `…`.
 *
 * ```js
 * {{ellipsis "<span>foo bar baz</span>", 7}}
 * //=> 'foo bar…'
 * ```
 * @name .ellipsis
 * @param {String} `str`
 * @param {Number} `length` The desired length of the returned string.
 * @return {String} The truncated string.
 * @api public
 */

helpers.ellipsis = function (str, limit) {
  if (str && typeof str === 'string') {
    if (str.length <= limit) {
      return str;
    }
    return truncate(str, limit) + '…';
  }
};


/**
 * Strip HTML tags from a string, so that only the text nodes
 * are preserved.
 *
 * ```js
 * {{sanitize "<span>foo</span>"}}
 * //=> 'foo'
 * ```
 *
 * @param  {String} `str` The string of HTML to sanitize.
 * @return {String}
 * @api public
 */

helpers.sanitize = function (str) {
  return sanitize(str);
};


/**
 * Block helper for creating unordered lists (`<ul></ul>`)
 *
 * @param  {Object} `context`
 * @return {String}
 * @block
 * @api public
 */

helpers.ul = function (context) {
  const options = arguments[arguments.length - 1];
  return ('<ul ' + (parseAttributes(options.hash)) + '>') + context.map(function (item) {
    if (typeof item !== 'string') {
      item = options.fn(item);
    }
    return '<li>' + item + '</li>';
  }).join('\n') + '</ul>';
};

/**
 * Block helper for creating ordered lists  (`<ol></ol>`)
 *
 * @param  {Object} `context`
 * @return {String}
 * @block
 * @api public
 */

helpers.ol = function (context) {
  const options = arguments[arguments.length - 1];
  return ('<ol ' + (parseAttributes(options.hash)) + '>') + context.map(function (item) {
    if (typeof item !== 'string') {
      item = options.fn(item);
    }
    return '<li>' + item + '</li>';
  }).join('\n') + '</ol>';
};

/**
 * Returns a `<figure>` with a thumbnail linked to a full picture
 *
 * @param  {Object} `context` Object with values/attributes to add to the generated elements:
 * @param {String} `context.alt`
 * @param {String} `context.src`
 * @param {Number} `context.width`
 * @param {Number} `context.height`
 * @return {String} HTML `<figure>` element with image and optional caption/link.
 * @contributor: Marie Hogebrandt <https://github.com/Melindrea>
 * @api public
 */

helpers.thumbnailImage = function (context) {
  var figure = '';
  var image = '';

  var link = context.full || false;
  var imageAttributes = {
    alt: context.alt,
    src: context.thumbnail,
    width: context.size.width,
    height: context.size.height
  };

  var figureAttributes = { id: 'image-' + context.id };
  var linkAttributes = { href: link, rel: 'thumbnail' };

  if (context.classes) {
    if (context.classes.image) {
      imageAttributes.class = context.classes.image.join(' ');
    }
    if (context.classes.figure) {
      figureAttributes.class = context.classes.figure.join(' ');
    }
    if (context.classes.link) {
      linkAttributes.class = context.classes.link.join(' ');
    }
  }

  figure += '<figure ' + parseAttributes(figureAttributes) + '>\n';
  image += '<img ' + parseAttributes(imageAttributes) + '>\n';

  if (link) {
    figure += '<a ' + parseAttributes(linkAttributes) + '>\n' + image + '</a>\n';
  } else {
    figure += image;
  }

  if (context.caption) {
    figure += '<figcaption>' + context.caption + '</figcaption>\n';
  }

  figure += '</figure>';
  return figure;
};