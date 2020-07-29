function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { logFrontendAuthError, processAxiosErrorAndThrow } from './utils';
import createRetryInterceptor from './interceptors/createRetryInterceptor';
var httpClient = axios.create(); // Set withCredentials to true. Enables cross-site Access-Control requests
// to be made using cookies, authorization headers or TLS client
// certificates. More on MDN:
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials

httpClient.defaults.withCredentials = true; // Add retries to this axios instance

httpClient.interceptors.response.use(function (response) {
  return response;
}, createRetryInterceptor({
  httpClient: httpClient
}));
var cookies = new Cookies();

var decodeJwtCookie = function decodeJwtCookie(cookieName) {
  var cookieValue = cookies.get(cookieName);

  if (cookieValue) {
    try {
      return jwtDecode(cookieValue);
    } catch (e) {
      var error = Object.create(e);
      error.message = 'Error decoding JWT token';
      error.customAttributes = {
        cookieValue: cookieValue
      };
      throw error;
    }
  }

  return null;
};

var isTokenExpired = function isTokenExpired(token) {
  return !token || token.exp < Date.now() / 1000;
};

var refreshRequestPromises = {};

var refresh = function refresh(tokenCookieName, refreshEndpoint) {
  if (refreshRequestPromises[tokenCookieName] === undefined) {
    var makeRefreshRequest =
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var axiosResponse, userIsUnauthenticated, _decodedJwtToken, decodedJwtToken, error;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.prev = 1;
                _context.next = 4;
                return httpClient.post(refreshEndpoint);

              case 4:
                axiosResponse = _context.sent;
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](1);
                processAxiosErrorAndThrow(_context.t0);

              case 10:
                _context.next = 20;
                break;

              case 12:
                _context.prev = 12;
                _context.t1 = _context["catch"](0);
                userIsUnauthenticated = _context.t1.response && _context.t1.response.status === 401;

                if (!userIsUnauthenticated) {
                  _context.next = 19;
                  break;
                }

                // Clean up the cookie if it exists to eliminate any situation
                // where the cookie is not expired but the jwt is expired.
                cookies.remove(tokenCookieName);
                _decodedJwtToken = null;
                return _context.abrupt("return", _decodedJwtToken);

              case 19:
                throw _context.t1;

              case 20:
                decodedJwtToken = decodeJwtCookie(tokenCookieName);

                if (decodedJwtToken) {
                  _context.next = 25;
                  break;
                }

                // This is an unexpected case. The refresh endpoint should
                // set the cookie that is needed. See ARCH-948 for more
                // information on a similar situation that was happening
                // prior to this refactor in Oct 2019.
                error = new Error('Access token is still null after successful refresh.');
                error.customAttributes = {
                  axiosResponse: axiosResponse
                };
                throw error;

              case 25:
                return _context.abrupt("return", decodedJwtToken);

              case 26:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 12], [1, 7]]);
      }));

      return function makeRefreshRequest() {
        return _ref.apply(this, arguments);
      };
    }();

    refreshRequestPromises[tokenCookieName] = makeRefreshRequest()["finally"](function () {
      delete refreshRequestPromises[tokenCookieName];
    });
  }

  return refreshRequestPromises[tokenCookieName];
};

var getJwtToken =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(tokenCookieName, tokenRefreshEndpoint) {
    var decodedJwtToken;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            decodedJwtToken = decodeJwtCookie(tokenCookieName);

            if (isTokenExpired(decodedJwtToken)) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return", decodedJwtToken);

          case 4:
            _context2.next = 9;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](0);
            // Log unexpected error and continue with attempt to refresh it.
            logFrontendAuthError(_context2.t0);

          case 9:
            _context2.prev = 9;
            _context2.next = 12;
            return refresh(tokenCookieName, tokenRefreshEndpoint);

          case 12:
            return _context2.abrupt("return", _context2.sent);

          case 15:
            _context2.prev = 15;
            _context2.t1 = _context2["catch"](9);
            logFrontendAuthError(_context2.t1);
            throw _context2.t1;

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 6], [9, 15]]);
  }));

  return function getJwtToken(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

export default getJwtToken;
export { httpClient };
//# sourceMappingURL=getJwtToken.js.map