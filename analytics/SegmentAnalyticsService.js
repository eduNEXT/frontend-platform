function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import formurlencoded from 'form-urlencoded';
import { snakeCaseObject } from '../utils';
/**
 * @implements {AnalyticsService}
 * @memberof module:Analytics
 */

var SegmentAnalyticsService =
/*#__PURE__*/
function () {
  function SegmentAnalyticsService(_ref) {
    var httpClient = _ref.httpClient,
        loggingService = _ref.loggingService,
        config = _ref.config;

    _classCallCheck(this, SegmentAnalyticsService);

    this.loggingService = loggingService;
    this.httpClient = httpClient;
    this.trackingLogApiUrl = "".concat(config.LMS_BASE_URL, "/event");
    this.segmentKey = config.SEGMENT_KEY;
    this.initialize();
  } // The code in this function is from Segment's website, with the following
  // update: - Takes the segment key as a parameter (
  // https://segment.com/docs/sources/website/analytics.js/quickstart/


  _createClass(SegmentAnalyticsService, [{
    key: "initialize",
    value: function initialize() {
      // Create a queue, but don't obliterate an existing one!
      global.analytics = global.analytics || [];
      var _global = global,
          analytics = _global.analytics; // If the real analytics.js is already on the page return.

      if (analytics.initialize) return; // If the snippet was invoked do nothing.

      if (analytics.invoked) {
        return;
      } // Invoked flag, to make sure the snippet
      // is never invoked twice.


      analytics.invoked = true; // A list of the methods in Analytics.js to stub.

      analytics.methods = ['trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'pageview', 'identify', 'reset', 'group', 'track', 'ready', 'alias', 'debug', 'page', 'once', 'off', 'on']; // Define a factory to create stubs. These are placeholders
      // for methods in Analytics.js so that you never have to wait
      // for it to load to actually record data. The `method` is
      // stored as the first argument, so we can replay the data.

      analytics.factory = function (method) {
        return function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          args.unshift(method);
          analytics.push(args);
          return analytics;
        };
      }; // For each of our methods, generate a queueing stub.


      analytics.methods.forEach(function (key) {
        analytics[key] = analytics.factory(key);
      }); // Define a method to load Analytics.js from our CDN,
      // and that will be sure to only ever load it once.

      analytics.load = function (key, options) {
        // Create an async script element based on your key.
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = "https://cdn.segment.com/analytics.js/v1/".concat(key, "/analytics.min.js"); // Insert our script next to the first script element.

        var first = document.getElementsByTagName('script')[0];
        first.parentNode.insertBefore(script, first);
        analytics._loadOptions = options; // eslint-disable-line no-underscore-dangle
      }; // Add a version to keep track of what's in the wild.


      analytics.SNIPPET_VERSION = '4.1.0'; // Load Analytics.js with your key, which will automatically
      // load the tools you've enabled for your account. Boosh!

      analytics.load(this.segmentKey);
    }
    /**
     * Checks that identify was first called.  Otherwise, logs error.
     *
     */

  }, {
    key: "checkIdentifyCalled",
    value: function checkIdentifyCalled() {
      if (!this.hasIdentifyBeenCalled) {
        this.loggingService.logError('Identify must be called before other tracking events.');
      }
    }
    /**
     * Logs events to tracking log and downstream.
     * For tracking log event documentation, see
     * https://openedx.atlassian.net/wiki/spaces/AN/pages/13205895/Event+Design+and+Review+Process
     *
     * @param {string} eventName (event_type on backend, but named to match Segment api)
     * @param {Object} properties (event on backend, but named properties to match Segment api)
     * @returns {Promise} The promise returned by HttpClient.post.
     */

  }, {
    key: "sendTrackingLogEvent",
    value: function sendTrackingLogEvent(eventName, properties) {
      var _this = this;

      var snakeEventData = snakeCaseObject(properties, {
        deep: true
      });
      var serverData = {
        event_type: eventName,
        event: JSON.stringify(snakeEventData),
        page: global.location.href
      };
      return this.httpClient.post(this.trackingLogApiUrl, formurlencoded(serverData), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })["catch"](function (error) {
        _this.loggingService.logError(error);
      });
    }
    /**
     * * Send identify call to Segment.
     *
     * @param {string} userId
     * @param {*} [traits]
     */

  }, {
    key: "identifyAuthenticatedUser",
    value: function identifyAuthenticatedUser(userId, traits) {
      if (!userId) {
        throw new Error('UserId is required for identifyAuthenticatedUser.');
      }

      global.analytics.identify(userId, traits);
      this.hasIdentifyBeenCalled = true;
    }
    /**
     * Send anonymous identify call to Segment's identify.
     *
     * @param {*} [traits]
     */

  }, {
    key: "identifyAnonymousUser",
    value: function identifyAnonymousUser(traits) {
      global.analytics.identify(traits);
      this.hasIdentifyBeenCalled = true;
    }
    /**
     * Sends a track event to Segment and downstream.
     * Note: For links and forms, you should use trackLink and trackForm instead.
     *
     * @param {*} eventName
     * @param {*} [properties]
     */

  }, {
    key: "sendTrackEvent",
    value: function sendTrackEvent(eventName, properties) {
      this.checkIdentifyCalled();
      global.analytics.track(eventName, properties);
    }
    /**
     * Sends a page event to Segment and downstream.
     *
     * @param {*} [name] If only one string arg provided, assumed to be name.
     * @param {*} [category] Name is required to pass a category.
     * @param {*} [properties]
     */

  }, {
    key: "sendPageEvent",
    value: function sendPageEvent(category, name, properties) {
      this.checkIdentifyCalled();
      global.analytics.page(category, name, properties);
    }
  }]);

  return SegmentAnalyticsService;
}();

_defineProperty(SegmentAnalyticsService, "hasIdentifyBeenCalled", false);

export default SegmentAnalyticsService;
//# sourceMappingURL=SegmentAnalyticsService.js.map