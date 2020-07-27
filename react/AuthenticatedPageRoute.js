function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import AppContext from './AppContext';
import LoginRedirect from './LoginRedirect';
import PageRoute from './PageRoute';
/**
 * A react-router route that redirects to the login page when the route becomes active and the user
 * is not authenticated.  If the application has been initialized with `requireAuthenticatedUser`
 * false, an authenticatedPageRoute can be used to protect a subset of the application's routes,
 * rather than the entire application.
 *
 * Like a `PageRoute`, also calls `sendPageEvent` when the route becomes active.
 *
 * @see PageRoute
 * @see {@link module:frontend-platform/analytics~sendPageEvent}
 * @memberof module:React
 * @param {Object} props
 */

export default function AuthenticatedPageRoute(props) {
  var _useContext = useContext(AppContext),
      authenticatedUser = _useContext.authenticatedUser; // We need to let Route "render" the redirect - if we did it here in AuthenticatedRoute, it'd
  // execute immediately, rather than when the router determines the route should become active.


  if (authenticatedUser === null) {
    return /*#__PURE__*/React.createElement(Route, _extends({}, props, {
      component: LoginRedirect
    }));
  }

  return /*#__PURE__*/React.createElement(PageRoute, props);
}
//# sourceMappingURL=AuthenticatedPageRoute.js.map