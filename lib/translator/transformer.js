'use strict';

/**
 * @module paper/lib/translator/transformer
 *
 * This should be considered an internal concern of Translator, and not a
 * public interface.
 */

/**
 * Transform translations from the representation provided by stencil bundle
 * into something that enables fast lookups in the `lang` helper.
 *
 * The `allTranslations` object looks like this:
 * {
 *   en: {
 *     salutations: {
 *       welcome: 'Welcome',
 *       hello: 'Hello {name}',
 *       bye: 'Bye bye',
 *     }
 *     items: '{count, plural, one{1 Item} other{# Items}}',
 *   },
 *   fr: {
 *     salutations: {
 *       hello: 'Bonjour {name}',
 *       bye: 'au revoir',
 *     }
 *   },
 *   'fr-CA': {
 *     salutations: {
 *       hello: 'Salut {name}',
 *     },
 *   },
 * }
 *
 * The return value looks like this, assuming preferredLocales of ['fr-CA', 'en']:
 * {
 *   locale: 'fr-CA',
 *   locales: {
 *     'salutations.welcome': 'en',
 *     'salutations.hello': 'fr-CA',
 *     'salutations.bye': 'fr',
 *     items: 'en',
 *   },
 *   translations: {
 *     'salutations.welcome': 'Welcome',
 *     'salutations.hello': 'Salut {name}',
 *     'salutations.bye': 'au revoir',
 *     items: '{count, plural, one{1 Item} other{# Items}}',
 *   }
 * }
 *
 * @param {Object.<string, Object>} allTranslations
 * @param {string[]} preferredLocales
 * @param {Object} logger
 * @returns {Object.<string, string|Object>} Transformed translations
 */
function transform(allTranslations, preferredLocales, logger = console) {
  const flattened = flatten(allTranslations, preferredLocales, logger);
  return cascade(flattened, preferredLocales);
}

/**
 * Flatten translation keys to a single top-level namespace, keeping only necessary
 * languages based on preferredLocales.
 *
 * The `allTranslations` object looks like this:
 * {
 *   en: {
 *     salutations: {
 *       welcome: 'Welcome',
 *       hello: 'Hello {name}',
 *       bye: 'Bye bye',
 *       formal: {
 *           bye: 'Farewell',
 *       }
 *     }
 *     items: '{count, plural, one{1 Item} other{# Items}}',
 *   },
 *   fr: {
 *     salutations: {
 *       hello: 'Bonjour {name}',
 *       bye: 'au revoir',
 *     }
 *   },
 *   'fr-CA': {
 *     salutations: {
 *       hello: 'Salut {name}',
 *     },
 *   },
 *   'de': {
 *     salutations: {
 *       hello: 'Hallo {name}',
 *     },
 *   },
 * }
 *
 * The return value looks like this, assuming preferredLocales of ['fr-CA', 'en']:
 * {
 *   en: {
 *     'salutations.welcome': 'Welcome',
 *     'salutations.hello': 'Hello {name}',
 *     'salutations.bye': 'Bye bye',
 *     'salutations.formal.bye': 'Farewell',
 *     items: '{count, plural, one{1 Item} other{# Items}}',
 *   },
 *   fr: {
 *     'salutations.hello': 'Bonjour {name}',
 *     'salutations.bye': 'au revoir',
 *   },
 *   'fr-CA': {
 *     'salutations.hello': 'Salut {name}',
 *   },
 * }
 * @param {Object.<string, Object>} translations
 * @param {string[]} preferredLocales
 * @param {Object} logger
 * @returns {Object.<string, Object>} Flattened translations
 */
function flatten(translations, preferredLocales, logger = console) {
  const result = {};
  for (let i = 0; i < preferredLocales.length; i++) {
    const locale = preferredLocales[i];
    try {
      result[locale] = flattenObject(translations[locale]);
    } catch (err) {
      logger.warn(`Failed to flatten ${locale} - Error: ${err}`);
      result[locale] = {};
    }
  }
  return result;
}

/**
 * Cascade translations by providing appropriate fallback values. For example, if 'fr-CA'
 * is requested but the translation override doesn't exist, we fallback first to 'fr', then
 * to the defaultLocale (usually 'en').
 *
 * flattenedTranslations looks like this:
 * {
 *   en: {
 *     'salutations.welcome': 'Welcome',
 *     'salutations.hello': 'Hello {name}',
 *     'salutations.bye': 'Bye bye',
 *     items: '{count, plural, one{1 Item} other{# Items}}',
 *   },
 *   fr: {
 *     'salutations.hello': 'Bonjour {name}',
 *     'salutations.bye': 'au revoir',
 *   },
 *   'fr-CA': {
 *     'salutations.hello': 'Salut {name}',
 *   },
 * }
 *
 * The return value looks like this, assuming preferredLocales of ['fr-CA', 'en']:
 * {
 *   locale: 'fr-CA',
 *   locales: {
 *     'salutations.welcome': 'en',
 *     'salutations.hello': 'fr-CA',
 *     'salutations.bye': 'fr',
 *     items: 'en',
 *   },
 *   translations: {
 *     'salutations.welcome': 'Welcome',
 *     'salutations.hello': 'Salut {name}',
 *     'salutations.bye': 'au revoir',
 *     items: '{count, plural, one{1 Item} other{# Items}}',
 *   }
 * }
 *
 * @param {Object.<string, Object>} translations Flattened translations
 * @param {string[]} preferredLocales Ordered list of preferred locales
 * @returns {Object.<string, string|Object>} Cascaded translations spec
 */
function cascade(translations, preferredLocales) {
  const result = { locale: preferredLocales[0], locales: {}, translations: {} };

  // Process the list of locales in reverse order of preference for proper layering
  const localeList = preferredLocales.slice().reverse();

  // Build the layered set of translations
  for (let i = 0; i < localeList.length; i++) {
    const locale = localeList[i];
    for (const key in translations[locale]) {
      result.locales[key] = locale;
      result.translations[key] = translations[locale][key];
    }
  }

  return result;
}

/**
 * Internal method to flatten nested JSON to the top level, transforming nested keys
 * using dot syntax.
 *
 * If the object looks like this:
 * {
 *   salutations: {
 *     welcome: 'Welcome',
 *     hello: 'Hello {name}',
 *     bye: 'Bye bye',
 *     formal: {
 *         bye: 'Farewell',
 *     }
 *   }
 * }
 *
 * Then the return value would look like this:
 * {
 *   'salutations.welcome': 'Welcome',
 *   'salutations.hello': 'Hello {name}',
 *   'salutations.bye': 'Bye bye',
 *   'salutations.formal.bye': 'Farewell',
 * },
 *
 * @private
 * @param {Object} object The object to process
 * @param {Object} [result] Caller is expected to pass in an empty object to store the result
 * @param {string} [parentKey] An optional parent key, used in recursive calls
 * @returns {Object} Object with flattened keys
 */
function flattenObject(object, result, parentKey) {
  result = result || {};
  parentKey = parentKey || '';

  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const flattenedKey = parentKey !== '' ? `${parentKey}.${key}` : key;
    if (typeof object[key] === 'object') {
      flattenObject(object[key], result, flattenedKey);
    } else {
      result[flattenedKey] = object[key];
    }
  }
  return result;
}

module.exports = {
  cascade,
  flatten,
  transform,
};