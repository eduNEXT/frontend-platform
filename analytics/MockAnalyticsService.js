function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * The MockAnalyticsService implements all functions of AnalyticsService as Jest mocks (jest.fn())).
 * It emulates the behavior of a real analytics service but witohut making any requests. It has no
 * other functionality.
 *
 * @implements {AnalyticsService}
 * @memberof module:Analytics
 */
class MockAnalyticsService {
  constructor(_ref) {
    let {
      httpClient,
      loggingService
    } = _ref;
    _defineProperty(this, "checkIdentifyCalled", jest.fn(() => {
      if (!this.hasIdentifyBeenCalled) {
        this.loggingService.logError('Identify must be called before other tracking events.');
      }
    }));
    /**
     * Returns a resolved promise.
     *
     * @returns {Promise} The promise returned by HttpClient.post.
     */
    _defineProperty(this, "sendTrackingLogEvent", jest.fn(() => Promise.resolve()));
    /**
     * No-op, but records that identify has been called.
     *
     * @param {string} userId
     * @throws {Error} If userId argument is not supplied.
     */
    _defineProperty(this, "identifyAuthenticatedUser", jest.fn(userId => {
      if (!userId) {
        throw new Error('UserId is required for identifyAuthenticatedUser.');
      }
      this.hasIdentifyBeenCalled = true;
    }));
    /**
     * No-op, but records that it has been called to prevent double-identification.
     * @returns {Promise} A resolved promise.
     */
    _defineProperty(this, "identifyAnonymousUser", jest.fn(() => {
      this.hasIdentifyBeenCalled = true;
      return Promise.resolve();
    }));
    /**
     * Logs the event to the console.
     *
     * Checks whether identify has been called, logging an error to the logging service if not.
     */
    _defineProperty(this, "sendTrackEvent", jest.fn(() => {
      this.checkIdentifyCalled();
    }));
    /**
     * Logs the event to the console.
     *
     * Checks whether identify has been called, logging an error to the logging service if not.
     */
    _defineProperty(this, "sendPageEvent", jest.fn(() => {
      this.checkIdentifyCalled();
    }));
    this.loggingService = loggingService;
    this.httpClient = httpClient;
  }
}
_defineProperty(MockAnalyticsService, "hasIdentifyBeenCalled", false);
export default MockAnalyticsService;
//# sourceMappingURL=MockAnalyticsService.js.map