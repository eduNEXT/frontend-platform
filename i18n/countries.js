function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import COUNTRIES, { langs as countryLangs } from 'i18n-iso-countries';
import { getPrimaryLanguageSubtag } from './lib';
/*
 * COUNTRY LISTS
 *
 * Lists of country names localized in supported languages.
 *
 * TODO: When we start dynamically loading translations only for the current locale, change this.
 */

COUNTRIES.registerLocale(require('i18n-iso-countries/langs/ar.json'));
COUNTRIES.registerLocale(require('i18n-iso-countries/langs/en.json'));
COUNTRIES.registerLocale(require('i18n-iso-countries/langs/es.json'));
COUNTRIES.registerLocale(require('i18n-iso-countries/langs/fr.json'));
COUNTRIES.registerLocale(require('i18n-iso-countries/langs/zh.json'));
COUNTRIES.registerLocale(require('i18n-iso-countries/langs/ca.json'));
COUNTRIES.registerLocale(require('i18n-iso-countries/langs/he.json'));
COUNTRIES.registerLocale(require('i18n-iso-countries/langs/id.json'));
COUNTRIES.registerLocale(require('i18n-iso-countries/langs/ko.json'));
COUNTRIES.registerLocale(require('i18n-iso-countries/langs/pl.json'));
COUNTRIES.registerLocale(require('i18n-iso-countries/langs/pt.json'));
COUNTRIES.registerLocale(require('i18n-iso-countries/langs/ru.json')); // COUNTRIES.registerLocale(require('i18n-iso-countries/langs/th.json')); // Doesn't exist in lib.

COUNTRIES.registerLocale(require('i18n-iso-countries/langs/uk.json'));
/**
 * Provides a lookup table of country IDs to country names for the current locale.
 *
 * @memberof module:I18n
 */

export function getCountryMessages(locale) {
  var primaryLanguageSubtag = getPrimaryLanguageSubtag(locale);
  var languageCode = countryLangs().includes(primaryLanguageSubtag) ? primaryLanguageSubtag : 'en';
  return COUNTRIES.getNames(languageCode);
}
/**
 * Provides a list of countries represented as objects of the following shape:
 *
 * {
 *   key, // The ID of the country
 *   name // The localized name of the country
 * }
 *
 * TODO: ARCH-878: The list should be sorted alphabetically in the current locale.
 * This is useful for populating dropdowns.
 *
 * @memberof module:I18n
 */

export function getCountryList(locale) {
  var countryMessages = getCountryMessages(locale);
  return Object.entries(countryMessages).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        code = _ref2[0],
        name = _ref2[1];

    return {
      code: code,
      name: name
    };
  });
}
//# sourceMappingURL=countries.js.map