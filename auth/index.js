function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * #### Import members from **@edx/frontend-platform/auth**
 * Simplifies the process of making authenticated API requests to backend edX services by providing
 * common authN/authZ client code that enables the login/logout flow and handles ensuring the
 * presence of a valid [JWT cookie](https://github.com/edx/edx-platform/blob/master/openedx/core/djangoapps/oauth_dispatch/docs/decisions/0009-jwt-in-session-cookie.rst).
 *
 * The `initialize` function performs much of the auth configuration for you.  If, however, you're
 * not using the `initialize` function, an authenticated API client can be created via:
 *
 * ```
 * import {
 *   configure,
 *   fetchAuthenticatedUser,
 *   getAuthenticatedHttpClient
 * } from '@edx/frontend-platform/auth';
 * import { getConfig } from '@edx/frontend-platform';
 * import { getLoggingService } from '@edx/frontend-platform/logging';
 *
 * const {
 *   BASE_URL,
 *   LMS_BASE_URL,
 *   LOGIN_URL,
 *   LOGIN_URL,
 *   REFRESH_ACCESS_TOKEN_ENDPOINT,
 *   ACCESS_TOKEN_COOKIE_NAME,
 *   CSRF_TOKEN_API_PATH,
 * } = getConfig();
 *
 * configure({
 *   loggingService: getLoggingService(),
 *   appBaseUrl: BASE_URL,
 *   lmsBaseUrl: LMS_BASE_URL,
 *   loginUrl: LOGIN_URL,
 *   logoutUrl: LOGIN_URL,
 *   refreshAccessTokenEndpoint: REFRESH_ACCESS_TOKEN_ENDPOINT,
 *   accessTokenCookieName: ACCESS_TOKEN_COOKIE_NAME,
 *   csrfTokenApiPath: CSRF_TOKEN_API_PATH,
 * });
 *
 * const authenticatedUser = await fetchAuthenticatedUser(); // validates and decodes JWT token
 * const authenticatedHttpClient = getAuthenticatedHttpClient();
 * const response = await getAuthenticatedHttpClient().get(`https://example.com/api/user/data/${authenticatedUser.username}`); // fetching from an authenticated API using user data
 * ```
 *
 * As shown in this example, auth depends on the configuration document and logging.
 *
 * @module Auth
 */
import axios from 'axios';
import PropTypes from 'prop-types';
import { logFrontendAuthError } from './utils';
import addAuthenticationToHttpClient from './addAuthenticationToHttpClient';
import getJwtToken from './getJwtToken';
import { camelCaseObject, ensureDefinedConfig } from '../utils';
import { publish } from '../pubSub';
/**
 * @constant
 * @private
 */

export var AUTHENTICATED_USER_TOPIC = 'AUTHENTICATED_USER';
/**
 * Published when the authenticated user data changes.  This can happen when the authentication
 * service determines that the user is authenticated or anonymous, as well as when we fetch
 * additional user account data if the `hydrateAuthenticatedUser` flag has been set in the
 * `initialize` function.
 *
 * @event
 * @see {@link module:Initialization~initialize}
 */

export var AUTHENTICATED_USER_CHANGED = "".concat(AUTHENTICATED_USER_TOPIC, ".CHANGED"); // Singletons

var authenticatedHttpClient = null;
var config = null;
var authenticatedUser = null;
var configPropTypes = {
  appBaseUrl: PropTypes.string.isRequired,
  lmsBaseUrl: PropTypes.string.isRequired,
  loginUrl: PropTypes.string.isRequired,
  logoutUrl: PropTypes.string.isRequired,
  refreshAccessTokenEndpoint: PropTypes.string.isRequired,
  accessTokenCookieName: PropTypes.string.isRequired,
  csrfTokenApiPath: PropTypes.string.isRequired,
  loggingService: PropTypes.shape({
    logError: PropTypes.func.isRequired,
    logInfo: PropTypes.func.isRequired
  }).isRequired
};
/**
 * Configures an httpClient to make authenticated http requests.
 *
 * @param {Object} options
 * @param {string} options.appBaseUrl
 * @param {string} options.lmsBaseUrl
 * @param {string} options.loginUrl
 * @param {string} options.logoutUrl
 * @param {Object} options.loggingService requires logError and logInfo methods
 * @param {string} options.refreshAccessTokenEndpoint
 * @param {string} options.accessTokenCookieName
 * @param {string} options.csrfTokenApiPath
 */

export function configure(options) {
  ensureDefinedConfig(options, 'AuthService');
  PropTypes.checkPropTypes(configPropTypes, options, 'options', 'AuthService');
  config = options;
  authenticatedHttpClient = addAuthenticationToHttpClient(axios.create(), config);
}
/**
 * @ignore
 * @returns {LoggingService}
 */

export function getLoggingService() {
  return config.loggingService;
}
/**
 * Gets the apiClient singleton which is an axios instance.
 *
 * @returns {HttpClient} Singleton. A configured axios http client
 */

export function getAuthenticatedHttpClient() {
  return authenticatedHttpClient;
}
/**
 * Redirect the user to login
 *
 * @param {string} redirectUrl the url to redirect to after login
 */

export function redirectToLogin() {
  var redirectUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : config.appBaseUrl;
  global.location.assign("".concat(config.loginUrl, "?next=").concat(encodeURIComponent(redirectUrl)));
}
/**
 * Redirect the user to logout
 *
 * @param {string} redirectUrl the url to redirect to after logout
 */

export function redirectToLogout() {
  var redirectUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : config.appBaseUrl;
  global.location.assign("".concat(config.logoutUrl, "?redirect_url=").concat(encodeURIComponent(redirectUrl)));
}
/**
 * If it exists, returns the user data representing the currently authenticated user. If the user is
 * anonymous, returns null.
 *
 * @returns {UserData|null}
 */

export function getAuthenticatedUser() {
  return authenticatedUser;
}
/**
 * Sets the authenticated user to the provided value.
 *
 * @param {UserData} authUser
 * @emits AUTHENTICATED_USER_CHANGED
 */

export function setAuthenticatedUser(authUser) {
  authenticatedUser = authUser;
  publish(AUTHENTICATED_USER_CHANGED);
}
/**
 * Reads the authenticated user's access token. Resolves to null if the user is
 * unauthenticated.
 *
 * @returns {Promise<UserData>|Promise<null>} Resolves to the user's access token if they are
 * logged in.
 */

export function fetchAuthenticatedUser() {
  return _fetchAuthenticatedUser.apply(this, arguments);
}
/**
 * Ensures a user is authenticated. It will redirect to login when not
 * authenticated.
 *
 * @param {string} [redirectUrl=config.appBaseUrl] to return user after login when not
 * authenticated.
 * @returns {Promise<UserData>}
 */

function _fetchAuthenticatedUser() {
  _fetchAuthenticatedUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var decodedAccessToken;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getJwtToken(config.accessTokenCookieName, config.refreshAccessTokenEndpoint);

          case 2:
            decodedAccessToken = _context.sent;

            if (decodedAccessToken !== null) {
              setAuthenticatedUser({
                userId: decodedAccessToken.user_id,
                username: decodedAccessToken.preferred_username,
                roles: decodedAccessToken.roles || [],
                administrator: decodedAccessToken.administrator
              });
            }

            return _context.abrupt("return", getAuthenticatedUser());

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _fetchAuthenticatedUser.apply(this, arguments);
}

export function ensureAuthenticatedUser() {
  return _ensureAuthenticatedUser.apply(this, arguments);
}
/**
 * Fetches additional user account information for the authenticated user and merges it into the
 * existing authenticatedUser object, available via getAuthenticatedUser().
 *
 * ```
 *  console.log(authenticatedUser); // Will be sparse and only contain basic information.
 *  await hydrateAuthenticatedUser()
 *  const authenticatedUser = getAuthenticatedUser();
 *  console.log(authenticatedUser); // Will contain additional user information
 * ```
 *
 * @returns {Promise<null>}
 */

function _ensureAuthenticatedUser() {
  _ensureAuthenticatedUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var redirectUrl,
        isRedirectFromLoginPage,
        redirectLoopError,
        unauthorizedError,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            redirectUrl = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : config.appBaseUrl;
            _context2.next = 3;
            return fetchAuthenticatedUser();

          case 3:
            if (!(getAuthenticatedUser() === null)) {
              _context2.next = 13;
              break;
            }

            isRedirectFromLoginPage = global.document.referrer && global.document.referrer.startsWith(config.loginUrl);

            if (!isRedirectFromLoginPage) {
              _context2.next = 9;
              break;
            }

            redirectLoopError = new Error('Redirect from login page. Rejecting to avoid infinite redirect loop.');
            logFrontendAuthError(redirectLoopError);
            throw redirectLoopError;

          case 9:
            // The user is not authenticated, send them to the login page.
            redirectToLogin(redirectUrl);
            unauthorizedError = new Error('Failed to ensure the user is authenticated');
            unauthorizedError.isRedirecting = true;
            throw unauthorizedError;

          case 13:
            return _context2.abrupt("return", getAuthenticatedUser());

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _ensureAuthenticatedUser.apply(this, arguments);
}

export function hydrateAuthenticatedUser() {
  return _hydrateAuthenticatedUser.apply(this, arguments);
}
/**
 * A configured axios client. See axios docs for more
 * info https://github.com/axios/axios. All the functions
 * below accept isPublic and isCsrfExempt in the request
 * config options. Setting these to true will prevent this
 * client from attempting to refresh the jwt access token
 * or a csrf token respectively.
 *
 * ```
 *  // A public endpoint (no jwt token refresh)
 *  apiClient.get('/path/to/endpoint', { isPublic: true });
 * ```
 *
 * ```
 *  // A csrf exempt endpoint
 *  apiClient.post('/path/to/endpoint', { data }, { isCsrfExempt: true });
 * ```
 *
 * @name HttpClient
 * @interface
 * @memberof module:Auth
 * @property {function} get
 * @property {function} head
 * @property {function} options
 * @property {function} delete (csrf protected)
 * @property {function} post (csrf protected)
 * @property {function} put (csrf protected)
 * @property {function} patch (csrf protected)
 */

/**
 * @name UserData
 * @interface
 * @memberof module:Auth
 * @property {string} userId
 * @property {string} username
 * @property {Array} roles
 * @property {boolean} administrator
 */

function _hydrateAuthenticatedUser() {
  _hydrateAuthenticatedUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var user, response;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            user = getAuthenticatedUser();

            if (!(user !== null)) {
              _context3.next = 6;
              break;
            }

            _context3.next = 4;
            return authenticatedHttpClient.get("".concat(config.lmsBaseUrl, "/api/user/v1/accounts/").concat(user.username));

          case 4:
            response = _context3.sent;
            setAuthenticatedUser(_objectSpread({}, user, {}, camelCaseObject(response.data)));

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _hydrateAuthenticatedUser.apply(this, arguments);
}
//# sourceMappingURL=index.js.map