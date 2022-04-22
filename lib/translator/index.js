'use strict';

// This file was copied from @bigcommerce/paper

/**
 * @module paper/lib/translator
 */

const MessageFormat = require('messageformat');
const Filter = require('./filter');
const LocaleParser = require('./locale-parser');
const Transformer = require('./transformer');


/**
 * Default locale
 * @private
 * @type {string}
 */
const FALLBACK_LOCALE = 'en';

/**
 * Translator constructor
 *
 * @constructor
 * @param {string} acceptLanguage The Accept-Language header to be parsed to determine language to use
 * @param {Object} allTranslations Object containing all translations coming from theme
 * @param {Object} logger
 */
function Translator(acceptLanguage, allTranslations, logger = console) {
  /**
   * @private
   * @type {Object}
   */
  this._logger = logger;

  /**
   * @private
   * @type {string[]}
   */
  this._preferredLocales = LocaleParser.getPreferredLocales(acceptLanguage, Object.keys(allTranslations), FALLBACK_LOCALE);

  /**
   * @private
   * @type {Object.<string, string|Object>}
   *
   * Looks like this:
   * {
   *   locale: 'en',
   *   locales: {
   *     'salutations.welcome': 'en',
   *     'salutations.hello': 'en',
   *     'salutations.bye': 'en',
   *     items: 'en',
   *   }
   *   translations: {
   *     'salutations.welcome': 'Welcome',
   *     'salutations.hello': 'Hello {name}',
   *     'salutations.bye': 'Bye bye',
   *     items: '{count, plural, one{1 Item} other{# Items}}',
   *   }
   * }
   */
  this._language = Transformer.transform(allTranslations, this._preferredLocales, this._logger) || {};

  /**
   * @private
   * @type {Object.<string, MessageFormat>}
   */
  this._formatters = {};

  /**
   * @private
   * @type {Object.<string, function>}
   */
  this._formatFunctions = {};
}

/**
 * Translator factory method
 *
 * @static
 * @param {string} acceptLanguage
 * @param {Object} allTranslations
 * @param {Object} logger
 * @returns {Translator}
 */
Translator.create = function (acceptLanguage, allTranslations, logger = console) {
  return new Translator(acceptLanguage, allTranslations, logger);
};

/**
 * Get translated string
 *
 * @param {string} key
 * @param {Object} parameters
 * @returns {string}
 */
Translator.prototype.translate = function (key, parameters) {
  if (!this._language.translations || !this._language.translations[key]) {
    return key;
  }

  if (typeof this._formatFunctions[key] === 'undefined') {
    this._formatFunctions[key] = this._compileTemplate(key);
  }

  try {
    return this._formatFunctions[key](parameters);
  } catch (err) {
    this._logger.warn(err.message);
    return '';
  }
};

/**
 * Get primary locale name
 *
 * @returns {string} Primary locale
 */
Translator.prototype.getLocale = function () {
  return this._preferredLocales[0];
};

/**
 * Get language object
 *
 * @param {string} [keyFilter]
 * @returns {Object} Language object
 */
Translator.prototype.getLanguage = function (keyFilter) {
  if (keyFilter) {
    return Filter.filterByKey(this._language, keyFilter);
  }

  return this._language;
};

/**
 * Get formatter
 *
 * @private
 * @param {string} locale
 * @returns {MessageFormat} Return cached or new MessageFormat
 */
Translator.prototype._getFormatter = function (locale) {
  if (!this._formatters[locale]) {
    this._formatters[locale] = new MessageFormat(locale);
  }

  return this._formatters[locale];
};

/**
 * Compile a translation template and return a formatter function
 *
 * @private
 * @param {string} key
 * @return {Function}
 */
Translator.prototype._compileTemplate = function (key) {
  const locale = this._language.locales[key];
  const formatter = this._getFormatter(locale);

  try {
    return formatter.compile(this._language.translations[key]);
  } catch (err) {
    if (err.name === 'SyntaxError') {
      this._logger.warn(`Language File Syntax Error: ${err.message} for key "${key}"`, err.expected);
      return () => '';
    }

    throw err;
  }
};

module.exports = Translator;