function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * The MockLoggingService implements both logInfo and logError as jest mock functions via
 * jest.fn().  It has no other functionality.
 *
 * @implements {LoggingService}
 * @memberof module:Logging
 */
class MockLoggingService {
  constructor() {
    /**
     * Implemented as a jest.fn()
     *
     * @memberof MockLoggingService
     */
    _defineProperty(this, "logInfo", jest.fn());
    /**
     * Implemented as a jest.fn()
     *
     * @memberof MockLoggingService
     */
    _defineProperty(this, "logError", jest.fn());
    /**
     * Implemented as a jest.fn()
     *
     * @memberof MockLoggingService
     */
    _defineProperty(this, "setCustomAttribute", jest.fn());
  }
}
export default MockLoggingService;
//# sourceMappingURL=MockLoggingService.js.map