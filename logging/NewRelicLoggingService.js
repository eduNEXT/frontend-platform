function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * NewRelic will not log an error if it is too long.
 *
 * @ignore
 */
export var MAX_ERROR_LENGTH = 4000;

function fixErrorLength(error) {
  if (error.message && error.message.length > MAX_ERROR_LENGTH) {
    var processedError = Object.create(error);
    processedError.message = processedError.message.substring(0, MAX_ERROR_LENGTH);
    return processedError;
  } else if (typeof error === 'string' && error.length > MAX_ERROR_LENGTH) {
    return error.substring(0, MAX_ERROR_LENGTH);
  }

  return error;
}
/**
 * The NewRelicLoggingService is a concrete implementation of the logging service interface that
 * sends messages to NewRelic that can be seen in NewRelic Browser and NewRelic Insights. When in
 * development mode, all messages will instead be sent to the console.
 *
 * When you use `logError`, your errors will appear under "JS errors"
 * for your Browser application.
 *
 * ```
 * SELECT * from JavaScriptError WHERE errorStatus is not null SINCE 10 days ago
 * ```
 *
 * When using `logInfo`, these only appear in New Relic Insights when querying for page actions as
 * follows:
 *
 * ```
 * SELECT * from PageAction WHERE actionName = 'INFO' SINCE 1 hour ago
 * ```
 *
 * You can also add your own custom metrics as an additional argument, or see the code to find
 * other standard custom attributes.
 *
 * Requires the NewRelic Browser JavaScript snippet.
 *
 * @implements {LoggingService}
 * @memberof module:Logging
 */


var NewRelicLoggingService = /*#__PURE__*/function () {
  function NewRelicLoggingService() {
    _classCallCheck(this, NewRelicLoggingService);
  }

  _createClass(NewRelicLoggingService, [{
    key: "logInfo",

    /**
     *
     *
     * @param {*} message
     * @param {*} [customAttributes={}]
     * @memberof NewRelicLoggingService
     */
    value: function logInfo(message) {
      var customAttributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      /* istanbul ignore next */
      if (process.env.NODE_ENV === 'development') {
        console.log(message, customAttributes); // eslint-disable-line
      }
      /* istanbul ignore else */


      if (window && typeof window.newrelic !== 'undefined') {
        window.newrelic.addPageAction('INFO', Object.assign({}, {
          message: message
        }, customAttributes));
      }
    }
    /**
     *
     *
     * @param {*} error
     * @param {*} [customAttributes={}]
     * @memberof NewRelicLoggingService
     */

  }, {
    key: "logError",
    value: function logError(error) {
      var customAttributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var errorCustomAttributes = error.customAttributes || {};

      var allCustomAttributes = _objectSpread({}, errorCustomAttributes, {}, customAttributes);

      if (Object.keys(allCustomAttributes).length === 0) {
        // noticeError expects undefined if there are no custom attributes.
        allCustomAttributes = undefined;
      }
      /* istanbul ignore next */


      if (process.env.NODE_ENV === 'development') {
        console.error(error, allCustomAttributes); // eslint-disable-line
      }
      /* istanbul ignore else */


      if (window && typeof window.newrelic !== 'undefined') {
        // Note: customProperties are not sent.  Presumably High-Security Mode is being used.
        window.newrelic.noticeError(fixErrorLength(error), allCustomAttributes);
      }
    }
  }]);

  return NewRelicLoggingService;
}();

export { NewRelicLoggingService as default };
//# sourceMappingURL=NewRelicLoggingService.js.map