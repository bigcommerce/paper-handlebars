'use strict';

var url = require('url');

/**
 * Expose `helpers`
 */

var helpers = module.exports;

/**
 * Encodes a Uniform Resource Identifier (URI) component
 * by replacing each instance of certain characters by
 * one, two, three, or four escape sequences representing
 * the UTF-8 encoding of the character.
 *
 * @param  {String} `str` The un-encoded string
 * @return {String} The endcoded string
 * @api public
 */

helpers.encodeURI = function(str) {
  return encodeURIComponent(str);
};

/**
 * Decode a Uniform Resource Identifier (URI) component.
 *
 * @param  {String} `str`
 * @return {String}
 * @api public
 */

helpers.decodeURI = function(str) {
  return decodeURIComponent(str);
};

/**
 * Take a base URL, and a href URL, and resolve them as a
 * browser would for an anchor tag.
 *
 * @param  {String} `base`
 * @param  {String} `href`
 * @return {String}
 * @api public
 */

helpers.urlResolve = function(base, href) {
  return url.resolve(base, href);
};

/**
 * Parses a `url` string into an object.
 *
 * @param  {String} `str` URL string
 * @return {String} Returns stringified JSON
 * @api public
 */

helpers.urlParse = function(str) {
  return url.parse(str);
};


/**
 * Strip protocol from a `url`.
 *
 * Useful for displaying media that may have an 'http' protocol
 * on secure connections.  Will change 'http://foo.bar to `//foo.bar`
 *
 * @name .stripProtocol
 * @param {String} `str`
 * @return {String} the url with http protocol stripped
 * @api public
 */

helpers.stripProtocol = function(str) {
  var parsed = url.parse(str);
  delete parsed.protocol;
  return parsed.format();
};