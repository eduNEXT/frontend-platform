function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import LANGUAGES, { langs as languageLangs } from '@cospired/i18n-iso-languages';
import { getPrimaryLanguageSubtag } from './lib';
/*
 * LANGUAGE LISTS
 *
 * Lists of language names localized in supported languages.
 *
 * TODO: When we start dynamically loading translations only for the current locale, change this.
 * TODO: Also note that a bunch of languages are missing here. They're present but commented out
 * for reference. That's because they're not implemented in this library.  If you read this and it's
 * been a while, go check and see if that's changed!
 */
// LANGUAGES.registerLocale(require('@cospired/i18n-iso-languages/langs/ar.json'));

LANGUAGES.registerLocale(require('@cospired/i18n-iso-languages/langs/en.json'));
LANGUAGES.registerLocale(require('@cospired/i18n-iso-languages/langs/es.json'));
LANGUAGES.registerLocale(require('@cospired/i18n-iso-languages/langs/fr.json')); // LANGUAGES.registerLocale(require('@cospired/i18n-iso-languages/langs/zh.json'));
// LANGUAGES.registerLocale(require('@cospired/i18n-iso-languages/langs/ca.json'));
// LANGUAGES.registerLocale(require('@cospired/i18n-iso-languages/langs/he.json'));
// LANGUAGES.registerLocale(require('@cospired/i18n-iso-languages/langs/id.json'));
// LANGUAGES.registerLocale(require('@cospired/i18n-iso-languages/langs/ko.json'));

LANGUAGES.registerLocale(require('@cospired/i18n-iso-languages/langs/pl.json'));
LANGUAGES.registerLocale(require('@cospired/i18n-iso-languages/langs/pt.json')); // LANGUAGES.registerLocale(require('@cospired/i18n-iso-languages/langs/ru.json'));
// LANGUAGES.registerLocale(require('@cospired/i18n-iso-languages/langs/th.json'));
// LANGUAGES.registerLocale(require('@cospired/i18n-iso-languages/langs/uk.json'));

/**
 * Provides a lookup table of language IDs to language names for the current locale.
 *
 * @memberof I18n
 */

export var getLanguageMessages = function getLanguageMessages(locale) {
  var primaryLanguageSubtag = getPrimaryLanguageSubtag(locale);
  var languageCode = languageLangs().includes(primaryLanguageSubtag) ? primaryLanguageSubtag : 'en';
  return LANGUAGES.getNames(languageCode);
};
/**
 * Provides a list of languages represented as objects of the following shape:
 *
 * {
 *   key, // The ID of the language
 *   name // The localized name of the language
 * }
 *
 * TODO: ARCH-878: The list should be sorted alphabetically in the current locale.
 * This is useful for populating dropdowns.
 *
 * @memberof I18n
 */

export var getLanguageList = function getLanguageList(locale) {
  var languageMessages = getLanguageMessages(locale);
  return Object.entries(languageMessages).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        code = _ref2[0],
        name = _ref2[1];

    return {
      code: code,
      name: name
    };
  });
};
//# sourceMappingURL=languages.js.map