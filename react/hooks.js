function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
import { useCallback, useEffect, useState, useReducer } from 'react';
import { subscribe, unsubscribe } from '../pubSub';
import { PARAGON_THEME_CORE, PARAGON_THEME_VARIANT_LIGHT } from './constants';
import { paragonThemeReducer, paragonThemeActions } from './reducers';

/**
 * A React hook that allows functional components to subscribe to application events.  This should
 * be used sparingly - for the most part, Context should be used higher-up in the application to
 * provide necessary data to a given component, rather than utilizing a non-React-like Pub/Sub
 * mechanism.
 *
 * @memberof module:React
 * @param {string} type
 * @param {function} callback
 */
export var useAppEvent = function useAppEvent(type, callback) {
  useEffect(function () {
    var subscriptionToken = subscribe(type, callback);
    return function cleanup() {
      unsubscribe(subscriptionToken);
    };
  }, [callback, type]);
};
var initialParagonThemeState = {
  isThemeLoaded: false,
  themeVariant: PARAGON_THEME_VARIANT_LIGHT
};

/**
 * Adds/updates a `<link>` element in the HTML document to load the core application theme CSS.
 *
 * @memberof module:React
 * @param {object} args
 * @param {string} args.coreThemeUrl The url of the core theme CSS.
 * @param {string} args.onLoad A callback function called when the core theme CSS is loaded.
 */
export var useParagonThemeCore = function useParagonThemeCore(_ref) {
  var coreThemeUrl = _ref.coreThemeUrl,
    onLoad = _ref.onLoad;
  useEffect(function () {
    // If there is no config for the core theme url, do nothing.
    if (!coreThemeUrl) {
      return;
    }
    var coreThemeLink = document.head.querySelector("link[href='".concat(coreThemeUrl, "']"));
    if (!coreThemeLink) {
      coreThemeLink = document.createElement('link');
      coreThemeLink.href = coreThemeUrl;
      coreThemeLink.rel = 'stylesheet';
      coreThemeLink.onload = function () {
        onLoad();
      };
      document.head.insertAdjacentElement('afterbegin', coreThemeLink);
    }
  }, [coreThemeUrl, onLoad]);
};

/**
 * Adds/updates a `<link>` element in the HTML document to load each theme variant's CSS, setting the
 * non-current theme variants as "alternate" stylesheets. That is, the browser will still download
 * the CSS for the non-current theme variants, but at a lower priority than the current theme
 * variant's CSS. This ensures that if the theme variant is changed at runtime, the CSS for the new
 * theme variant will already be loaded.
 *
 * Note: only "light" theme variant is currently supported.
 *
 * @memberof module:React
 * @param {object} args
 * @param {object} args.themeVariantUrls An object representing the URLs for each supported theme variant, e.g.: `{ light: 'https://path/to/light.css' }`.
 * @param {string} args.onLoad A callback function called when the core theme CSS is loaded.
 */
var useParagonThemeVariants = function useParagonThemeVariants(_ref2) {
  var themeVariantUrls = _ref2.themeVariantUrls,
    currentThemeVariant = _ref2.currentThemeVariant,
    onLoadThemeVariantLight = _ref2.onLoadThemeVariantLight;
  useEffect(function () {
    /**
     * Determines the value for the `rel` attribute for a given theme variant based
     * on if its the currently applied variant.
     */
    var generateStylesheetRelAttr = function generateStylesheetRelAttr(themeVariant) {
      return currentThemeVariant === themeVariant ? 'stylesheet' : 'alternate stylesheet';
    };

    /**
     * A helper function to determine which theme variant callback should be used
     * based on the current theme variant.
     */
    var setThemeVariantLoaded = function setThemeVariantLoaded(themeVariant) {
      if (themeVariant === PARAGON_THEME_VARIANT_LIGHT) {
        onLoadThemeVariantLight();
      }
    };

    /**
     * Iterate over each theme variant URL and inject it into the HTML document if it doesn't already exist.
     */
    Object.entries(themeVariantUrls).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        themeVariant = _ref4[0],
        themeVariantUrl = _ref4[1];
      // If there is no config for the theme variant URL, set the theme variant to loaded and continue.
      if (!themeVariantUrl) {
        setThemeVariantLoaded(themeVariant);
        return;
      }
      var themeVariantLink = document.head.querySelector("link[href='".concat(themeVariantUrl, "']"));
      var stylesheetRelForVariant = generateStylesheetRelAttr(themeVariant);
      if (!themeVariantLink) {
        themeVariantLink = document.createElement('link');
        themeVariantLink.href = themeVariantUrl;
        themeVariantLink.rel = stylesheetRelForVariant;
        themeVariantLink.onload = function () {
          setThemeVariantLoaded(themeVariant);
        };
        document.head.insertAdjacentElement('beforeend', themeVariantLink);
      } else if (themeVariantLink.rel !== stylesheetRelForVariant) {
        themeVariantLink.rel = stylesheetRelForVariant;
      }
    });
  }, [themeVariantUrls, currentThemeVariant, onLoadThemeVariantLight]);
};

/**
 * TODO
 * @param {*} config
 * @returns
 */
var getParagonThemeUrls = function getParagonThemeUrls(config) {
  var _ref5;
  if (config.PARAGON_THEME_URLS) {
    return config.PARAGON_THEME_URLS;
  }
  return _ref5 = {}, _defineProperty(_ref5, PARAGON_THEME_CORE, config.PARAGON_THEME_CORE_URL), _defineProperty(_ref5, "variants", _defineProperty({}, PARAGON_THEME_VARIANT_LIGHT, config.PARAGON_THEME_VARIANTS_LIGHT_URL)), _ref5;
};

/**
 * Given the inputs of URLs to the CSS for the core application theme and the theme variants (e.g., light), this hook
 * will inject the CSS as `<link>` elements into the HTML document, loading each theme variant's CSS with an appropriate
 * priority based on whether its the currently active theme variant. This is done using "alternate" stylesheets. That
 * is,the browser will still download the CSS for the non-current theme variants, but at a lower priority than the
 * current theme variant's CSS. This ensures that if the theme variant is changed at runtime, the CSS for the new theme
 * variant will already be loaded.
 *
 * Note: only "light" theme variant is currently supported, though the intent is also support "dark" theme
 * variant in the future.
 *
 * @memberof module:React
 * @param {object} args
 * @param {object} args.themeUrls Should contain the URLs for the theme's core CSS and any theme
 *  variants, e.g. `{ core: 'https://path/to/core.css', variants: { light: 'https://path/to/light.css' } }`.
 *
 * @returns An array containing 2 elements: 1) an object containing the app
 *  theme state, and 2) a dispatch function to mutate the app theme state.
 */
export var useParagonTheme = function useParagonTheme(config) {
  var paragonThemeUrls = getParagonThemeUrls(config);
  var coreThemeUrl = paragonThemeUrls.core,
    themeVariantUrls = paragonThemeUrls.variants;
  var _useReducer = useReducer(paragonThemeReducer, initialParagonThemeState),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    themeState = _useReducer2[0],
    dispatch = _useReducer2[1];
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isCoreThemeLoaded = _useState2[0],
    setIsCoreThemeLoaded = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isLightThemeVariantLoaded = _useState4[0],
    setIsLightThemeVariantLoaded = _useState4[1];
  var onLoadThemeCore = useCallback(function () {
    setIsCoreThemeLoaded(true);
  }, []);
  var onLoadThemeVariantLight = useCallback(function () {
    setIsLightThemeVariantLoaded(true);
  }, []);

  // load the core theme CSS
  useParagonThemeCore({
    coreThemeUrl: coreThemeUrl,
    onLoad: onLoadThemeCore
  });

  // load the theme variant(s) CSS
  useParagonThemeVariants({
    themeVariantUrls: themeVariantUrls,
    onLoadThemeVariantLight: onLoadThemeVariantLight,
    currentThemeVariant: themeState.themeVariant
  });
  useEffect(function () {
    // theme is already loaded, do nothing
    if (themeState.isThemeLoaded) {
      return;
    }

    // the core theme and light theme variant is still loading, do nothing.
    var hasDefaultThemeConfig = coreThemeUrl && themeVariantUrls[PARAGON_THEME_VARIANT_LIGHT];
    if (!hasDefaultThemeConfig) {
      // no theme URLs to load, set loading to false.
      dispatch(paragonThemeActions.setParagonThemeLoaded(true));
    }
    var isDefaultThemeLoaded = isCoreThemeLoaded && isLightThemeVariantLoaded;
    if (!isDefaultThemeLoaded) {
      return;
    }

    // All application theme URLs are loaded
    dispatch(paragonThemeActions.setParagonThemeLoaded(true));
  }, [themeState.isThemeLoaded, isCoreThemeLoaded, isLightThemeVariantLoaded, themeVariantUrls, coreThemeUrl]);
  return [themeState, dispatch];
};
//# sourceMappingURL=hooks.js.map