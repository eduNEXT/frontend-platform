const _excluded = ["fileName"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
import { useMemo } from 'react';
import { handleVersionSubstitution } from './utils';

/**
 * Returns an object containing the URLs for the theme's core CSS and any theme variants.
 *
 * @param {*} config
 * @returns {ParagonThemeUrls|undefined} An object containing the URLs for the theme's core CSS and any theme variants.
 */
const useParagonThemeUrls = config => useMemo(() => {
  if (!config?.PARAGON_THEME_URLS) {
    return undefined;
  }
  const paragonThemeUrls = config.PARAGON_THEME_URLS;
  const paragonCoreCssUrl = typeof paragonThemeUrls.core.urls === 'object' ? paragonThemeUrls.core.urls.default : paragonThemeUrls.core.url;
  const brandCoreCssUrl = typeof paragonThemeUrls.core.urls === 'object' ? paragonThemeUrls.core.urls.brandOverride : undefined;
  const defaultThemeVariants = paragonThemeUrls.defaults;

  // Local versions of @edx/paragon and @edx/brand
  const localParagonVersion = PARAGON_THEME?.paragon?.version;
  const localBrandVersion = PARAGON_THEME?.brand?.version;
  const coreCss = {
    default: handleVersionSubstitution({
      url: paragonCoreCssUrl,
      wildcardKeyword: '$paragonVersion',
      localVersion: localParagonVersion
    }),
    brandOverride: handleVersionSubstitution({
      url: brandCoreCssUrl,
      wildcardKeyword: '$brandVersion',
      localVersion: localBrandVersion
    })
  };
  const themeVariantsCss = {};
  const themeVariantsEntries = Object.entries(paragonThemeUrls.variants || {});
  themeVariantsEntries.forEach(_ref => {
    let [themeVariant, {
      url,
      urls
    }] = _ref;
    const themeVariantMetadata = {
      urls: null
    };
    if (url) {
      themeVariantMetadata.urls = {
        default: handleVersionSubstitution({
          url,
          wildcardKeyword: '$paragonVersion',
          localVersion: localParagonVersion
        })
      };
    } else {
      themeVariantMetadata.urls = {
        default: handleVersionSubstitution({
          url: urls.default,
          wildcardKeyword: '$paragonVersion',
          localVersion: localParagonVersion
        }),
        brandOverride: handleVersionSubstitution({
          url: urls.brandOverride,
          wildcardKeyword: '$brandVersion',
          localVersion: localBrandVersion
        })
      };
    }
    themeVariantsCss[themeVariant] = themeVariantMetadata;
  });
  const hasMissingCssUrls = !coreCss.default || Object.keys(themeVariantsCss).length === 0;
  if (hasMissingCssUrls) {
    if (!PARAGON_THEME) {
      return undefined;
    }
    const themeVariants = {};
    const baseUrl = config.BASE_URL || window.location?.origin;
    const prependBaseUrl = url => `${baseUrl}/${url}`;
    themeVariantsEntries.forEach(_ref3 => {
      let [themeVariant, _ref2] = _ref3;
      let {
          fileName
        } = _ref2,
        rest = _objectWithoutProperties(_ref2, _excluded);
      themeVariants[themeVariant] = _objectSpread({
        url: prependBaseUrl(fileName)
      }, rest);
    });
    return {
      core: {
        urls: coreCss
      },
      defaults: defaultThemeVariants,
      variants: themeVariants
    };
  }
  return {
    core: {
      urls: coreCss
    },
    defaults: defaultThemeVariants,
    variants: themeVariantsCss
  };
}, [config?.BASE_URL, config?.PARAGON_THEME_URLS]);
export default useParagonThemeUrls;
//# sourceMappingURL=useParagonThemeUrls.js.map