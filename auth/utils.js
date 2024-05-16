function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// Lifted from here: https://regexr.com/3ok5o
const urlRegex = /([a-z]{1,2}tps?):\/\/((?:(?!(?:\/|#|\?|&)).)+)(?:(\/(?:(?:(?:(?!(?:#|\?|&)).)+\/))?))?(?:((?:(?!(?:\.|$|\?|#)).)+))?(?:(\.(?:(?!(?:\?|$|#)).)+))?(?:(\?(?:(?!(?:$|#)).)+))?(?:(#.+))?/;
const getUrlParts = url => {
  const found = url.match(urlRegex);
  try {
    const [fullUrl, protocol, domain, path, endFilename, endFileExtension, query, hash] = found;
    return {
      fullUrl,
      protocol,
      domain,
      path,
      endFilename,
      endFileExtension,
      query,
      hash
    };
  } catch (e) {
    throw new Error(`Could not find url parts from ${url}.`);
  }
};
const logFrontendAuthError = (loggingService, error) => {
  const prefixedMessageError = Object.create(error);
  prefixedMessageError.message = `[frontend-auth] ${error.message}`;
  loggingService.logError(prefixedMessageError, prefixedMessageError.customAttributes);
};
const processAxiosError = axiosErrorObject => {
  const error = Object.create(axiosErrorObject);
  const {
    request,
    response,
    config
  } = error;
  if (!config) {
    error.customAttributes = _objectSpread(_objectSpread({}, error.customAttributes), {}, {
      httpErrorType: 'unknown-api-request-error'
    });
    return error;
  }
  const {
    url: httpErrorRequestUrl,
    method: httpErrorRequestMethod
  } = config;
  /* istanbul ignore else: difficult to enter the request-only error case in a unit test */
  if (response) {
    const {
      status,
      data
    } = response;
    const stringifiedData = JSON.stringify(data) || '(empty response)';
    const responseIsHTML = stringifiedData.includes('<!DOCTYPE html>');
    // Don't include data if it is just an HTML document, like a 500 error page.
    /* istanbul ignore next */
    const httpErrorResponseData = responseIsHTML ? '<Response is HTML>' : stringifiedData;
    error.customAttributes = _objectSpread(_objectSpread({}, error.customAttributes), {}, {
      httpErrorType: 'api-response-error',
      httpErrorStatus: status,
      httpErrorResponseData,
      httpErrorRequestUrl,
      httpErrorRequestMethod
    });
    error.message = `Axios Error (Response): ${status} - See custom attributes for details.`;
  } else if (request) {
    error.customAttributes = _objectSpread(_objectSpread({}, error.customAttributes), {}, {
      httpErrorType: 'api-request-error',
      httpErrorMessage: error.message,
      httpErrorRequestUrl,
      httpErrorRequestMethod
    });
    // This case occurs most likely because of intermittent internet connection issues
    // but it also, though less often, catches CORS or server configuration problems.
    error.message = 'Axios Error (Request): (Possible local connectivity issue.) See custom attributes for details.';
  } else {
    error.customAttributes = _objectSpread(_objectSpread({}, error.customAttributes), {}, {
      httpErrorType: 'api-request-config-error',
      httpErrorMessage: error.message,
      httpErrorRequestUrl,
      httpErrorRequestMethod
    });
    error.message = 'Axios Error (Config): See custom attributes for details.';
  }
  return error;
};
const processAxiosErrorAndThrow = axiosErrorObject => {
  throw processAxiosError(axiosErrorObject);
};
export { getUrlParts, logFrontendAuthError, processAxiosError, processAxiosErrorAndThrow };
//# sourceMappingURL=utils.js.map