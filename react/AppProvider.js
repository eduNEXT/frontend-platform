function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'react-router-dom';
import OptionalReduxProvider from './OptionalReduxProvider';
import ErrorBoundary from './ErrorBoundary';
import AppContext from './AppContext';
import { useAppEvent } from './hooks';
import { getAuthenticatedUser, AUTHENTICATED_USER_CHANGED } from '../auth';
import { getConfig, CONFIG_CHANGED } from '../config';
import { history } from '../initialize';
import { getLocale, getMessages, IntlProvider, LOCALE_CHANGED } from '../i18n';
/**
 * A wrapper component for React-based micro-frontends to initialize a number of common data/
 * context providers.
 *
 * ```
 * subscribe(APP_READY, () => {
 *   ReactDOM.render(
 *     <AppProvider>
 *       <HelloWorld />
 *     </AppProvider>
 *   )
 * });
 * ```
 *
 * This will provide the following to HelloWorld:
 * - An error boundary as described above.
 * - An `AppContext` provider for React context data.
 * - IntlProvider for @edx/frontend-i18n internationalization
 * - Optionally a redux `Provider`. Will only be included if a `store` property is passed to
 * `AppProvider`.
 * - A `Router` for react-router.
 *
 * @param {Object} props
 * @param {Object} [props.store] A redux store.
 * @memberof module:React
 */

export default function AppProvider(_ref) {
  var store = _ref.store,
      children = _ref.children;

  var _useState = useState(getConfig()),
      _useState2 = _slicedToArray(_useState, 2),
      config = _useState2[0],
      setConfig = _useState2[1];

  var _useState3 = useState(getAuthenticatedUser()),
      _useState4 = _slicedToArray(_useState3, 2),
      authenticatedUser = _useState4[0],
      setAuthenticatedUser = _useState4[1];

  var _useState5 = useState(getLocale()),
      _useState6 = _slicedToArray(_useState5, 2),
      locale = _useState6[0],
      setLocale = _useState6[1];

  useAppEvent(AUTHENTICATED_USER_CHANGED, function () {
    setAuthenticatedUser(getAuthenticatedUser());
  });
  useAppEvent(CONFIG_CHANGED, function () {
    setConfig(getConfig());
  });
  useAppEvent(LOCALE_CHANGED, function () {
    setLocale(getLocale());
  });
  return React.createElement(ErrorBoundary, null, React.createElement(AppContext.Provider, {
    value: {
      authenticatedUser: authenticatedUser,
      config: config,
      locale: locale
    }
  }, React.createElement(IntlProvider, {
    locale: locale,
    messages: getMessages()
  }, React.createElement(OptionalReduxProvider, {
    store: store
  }, React.createElement(Router, {
    history: history,
    basename: getConfig().BASENAME
  }, React.createElement(React.Fragment, null, children))))));
}
AppProvider.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  store: PropTypes.object,
  children: PropTypes.node.isRequired
};
AppProvider.defaultProps = {
  store: null
};
//# sourceMappingURL=AppProvider.js.map