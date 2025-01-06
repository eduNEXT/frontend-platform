const _excluded = ["fileName"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
import { useMemo } from 'react';
import { fallbackThemeUrl, handleVersionSubstitution, isEmptyObject } from './utils';

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
  const paragonCoreCssUrl = typeof paragonThemeUrls?.core?.urls === 'object' ? paragonThemeUrls.core.urls.default : paragonThemeUrls?.core?.url;
  const brandCoreCssUrl = typeof paragonThemeUrls?.core?.urls === 'object' ? paragonThemeUrls.core.urls.brandOverride : undefined;
  const defaultThemeVariants = paragonThemeUrls.defaults;

  // Local versions of @openedx/paragon and @edx/brand
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

  // If we don't have  the core default or any theme variants, use the PARAGON_THEME
  if (!coreCss.default || isEmptyObject(themeVariantsCss)) {
    const localCoreUrl = PARAGON_THEME.paragon?.themeUrls?.core;
    const localThemeVariants = PARAGON_THEME.paragon?.themeUrls?.variants;
    if (isEmptyObject(localCoreUrl) || isEmptyObject(localThemeVariants)) {
      return undefined;
    }
    if (!coreCss.default) {
      coreCss.default = fallbackThemeUrl(localCoreUrl?.fileName);
    }
    if (isEmptyObject(themeVariantsCss)) {
      Object.entries(localThemeVariants).forEach(_ref3 => {
        let [themeVariant, _ref2] = _ref3;
        let {
            fileName
          } = _ref2,
          rest = _objectWithoutProperties(_ref2, _excluded);
        themeVariantsCss[themeVariant] = {
          urls: _objectSpread({
            default: fallbackThemeUrl(fileName)
          }, rest.urls)
        };
      });
    }
    return {
      core: {
        urls: coreCss
      },
      defaults: defaultThemeVariants,
      variants: themeVariantsCss
    };
  }
  return {
    core: {
      urls: coreCss
    },
    defaults: defaultThemeVariants,
    variants: themeVariantsCss
  };
}, [config?.PARAGON_THEME_URLS]);
export default useParagonThemeUrls;
//# sourceMappingURL=useParagonThemeUrls.js.map