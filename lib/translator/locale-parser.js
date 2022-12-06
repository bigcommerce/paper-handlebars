'use strict';

/**
 * @module paper/lib/translator/locale-parser
 *
 * This should be considered an internal concern of Translator, and not a
 * public interface.
 */
const AcceptLanguageParser = require('accept-language-parser');
const MessageFormat = require('messageformat');

/**
 * Parse the Accept-Language header and return the list of preferred locales
 * filtered based on the list of supported locales and making sure that MessageFormat
 * supports it as well.
 *
 * @param {string} acceptLanguageHeader The Accept-Language header
 * @param {Array} availableLocales A list of available locales from translations file
 * @param {string} fallbackLocale The default fallback locale
 * @returns {string[]} List of preferred+supported locales
 */
function getPreferredLocales(acceptLanguageHeader, availableLocales, fallbackLocale) {
  // Parse header
  const acceptableLocales = parseLocales(acceptLanguageHeader, fallbackLocale);

  // Filter based on list of available locales
  const preferredLocales = acceptableLocales.filter(locale => availableLocales.includes(locale));

  // Filter list based on what MessageFormat actually supports
  return preferredLocales.filter(locale => {
    try {
      new MessageFormat(locale);
      return true;
    } catch (err) {
      return false;
    }
  });
}

/**
 * Parse Accept-Language header and return a list of locales
 *
 * @param {string} acceptLanguageHeader The Accept-Language header
 * @param {string} fallbackLocale The default fallback locale
 * @returns {string[]} Ordered list of locale identifiers
 */
function parseLocales(acceptLanguageHeader, fallbackLocale) {
  // Parse the header, adding fallback to the very end of the list (via low quality)
  const parsed = AcceptLanguageParser.parse(`${acceptLanguageHeader},${fallbackLocale};q=0`);

  // Iterate through the parsed locales, pushing into a Set to deduplicate as we go along
  const locales = new Set();
  for (let i = 0; i < parsed.length; i++) {
    const locale = parsed[i];
    if (locale.region && locale.code) {
      locales.add(`${locale.code}-${locale.region}`);
    }

    // Insert regionless fallbacks into the chain. As an example, if fr-FR is in the chain,
    // but fr is not, add it. This enables appropriate fallback logic for the translations file.
    // If we have already seen it previously, it will not be added to the Set.
    if (locale.code) {
      locales.add(locale.code);
    }
  }

  // Return an array based on insertion order of the Set
  return [...locales];
}

module.exports = {
  getPreferredLocales,
};