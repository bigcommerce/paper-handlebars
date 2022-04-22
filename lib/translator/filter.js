'use strict';

/**
 * @module paper/lib/translator/filter
 *
 * This should be considered an internal concern of Translator, and not a
 * public interface.
*/

/*
* Internal method to filter an object containing string keys using the given keyPrefix
*
* @private
* @param {Object.<string, string>} obj
* @param {string} keyPrefix
* @returns {Object.<string, string>}
*/
function filterByKeyPrefix(obj, keyPrefix) {
  const result = {};
  for (const key in obj) {
    if (typeof key === 'string' && key.startsWith(keyPrefix)) {
      result[key] = obj[key];
    }
  }
  return result;
}


/**
 * Filter translation and locales of the given language object by translation key prefix.
 * This is used by the `langJson` helper. This method expects an object in the format
 * returned by `translator/transformer.js:transform()`.
 *
 * The incoming language object looks like this:
 * {
 *   locale: 'en',
 *   locales: {
 *     'salutations.welcome': 'en',
 *     'salutations.hello': 'en',
 *     'salutations.bye': 'en',
 *     items: 'en',
 *   },
 *   translations: {
 *     'salutations.welcome': 'Welcome',
 *     'salutations.hello': 'Hello {name}',
 *     'salutations.bye': 'Bye bye',
 *     items: '{count, plural, one{1 Item} other{# Items}}',
 *   }
 * }
 *
 * The return value, assuming `keyFilter` of `salutations`, would look like this:
 * {
 *   locale: 'en',
 *   locales: {
 *     'salutations.welcome': 'en',
 *     'salutations.hello': 'en',
 *     'salutations.bye': 'en',
 *   },
 *   translations: {
 *     'salutations.welcome': 'Welcome',
 *     'salutations.hello': 'Hello {name}',
 *     'salutations.bye': 'Bye bye',
 *   }
 * }
 * @param {Object.<string, string|Object>} language
 * @param {string} keyFilter
 * @returns {Object.<string, string|Object>}
 */
function filterLanguageObject(language, keyFilter) {
  return {
    locale: language.locale,
    locales: filterByKeyPrefix(language.locales, keyFilter),
    translations: filterByKeyPrefix(language.translations, keyFilter),
  };
}

module.exports = {
  filterByKey: filterLanguageObject,
};