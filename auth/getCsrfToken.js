function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import axios from 'axios';
import { getUrlParts, processAxiosErrorAndThrow } from './utils';
var httpClient = axios.create(); // Set withCredentials to true. Enables cross-site Access-Control requests
// to be made using cookies, authorization headers or TLS client
// certificates. More on MDN:
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials

httpClient.defaults.withCredentials = true;
httpClient.defaults.headers.common['USE-JWT-COOKIE'] = true;
var csrfTokenCache = {};
var csrfTokenRequestPromises = {};

var getCsrfToken = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, csrfTokenApiPath) {
    var urlParts, _urlParts, protocol, domain, csrfToken;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            try {
              urlParts = getUrlParts(url);
            } catch (e) {
              // If the url is not parsable it's likely because a relative
              // path was supplied as the url. This is acceptable and in
              // this case we should use the current origin of the page.
              urlParts = getUrlParts(global.location.origin);
            }

            _urlParts = urlParts, protocol = _urlParts.protocol, domain = _urlParts.domain;
            csrfToken = csrfTokenCache[domain];

            if (!csrfToken) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", csrfToken);

          case 5:
            if (!csrfTokenRequestPromises[domain]) {
              csrfTokenRequestPromises[domain] = httpClient.get("".concat(protocol, "://").concat(domain).concat(csrfTokenApiPath)).then(function (response) {
                csrfTokenCache[domain] = response.data.csrfToken;
                return csrfTokenCache[domain];
              })["catch"](processAxiosErrorAndThrow)["finally"](function () {
                delete csrfTokenRequestPromises[domain];
              });
            }

            return _context.abrupt("return", csrfTokenRequestPromises[domain]);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getCsrfToken(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var clearCsrfTokenCache = function clearCsrfTokenCache() {
  csrfTokenCache = {};
};

export default getCsrfToken;
export { httpClient, clearCsrfTokenCache };
//# sourceMappingURL=getCsrfToken.js.map