import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Row, Col } from '@openedx/paragon';
import { useAppEvent } from './hooks';
import { FormattedMessage, IntlProvider, getMessages, getLocale, LOCALE_CHANGED } from '../i18n';

/**
 * An error page that displays a generic message for unexpected errors.  Also contains a "Try
 * Again" button to refresh the page.
 *
 * @memberof module:React
 * @extends {Component}
 */
function ErrorPage(_ref) {
  let {
    message
  } = _ref;
  const [locale, setLocale] = useState(getLocale());
  useAppEvent(LOCALE_CHANGED, () => {
    setLocale(getLocale());
  });

  /* istanbul ignore next */
  const reload = () => {
    global.location.reload();
  };
  return /*#__PURE__*/React.createElement(IntlProvider, {
    locale: locale,
    messages: getMessages()
  }, /*#__PURE__*/React.createElement(Container, {
    fluid: true,
    className: "py-5 justify-content-center align-items-start text-center",
    "data-testid": "error-page"
  }, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Col, null, /*#__PURE__*/React.createElement("p", {
    className: "text-muted"
  }, /*#__PURE__*/React.createElement(FormattedMessage, {
    id: "unexpected.error.message.text",
    defaultMessage: "An unexpected error occurred. Please click the button below to refresh the page.",
    description: "error message when an unexpected error occurs"
  })), message && /*#__PURE__*/React.createElement("div", {
    role: "alert",
    className: "my-4"
  }, /*#__PURE__*/React.createElement("p", null, message)), /*#__PURE__*/React.createElement(Button, {
    onClick: reload
  }, /*#__PURE__*/React.createElement(FormattedMessage, {
    id: "unexpected.error.button.text",
    defaultMessage: "Try again",
    description: "text for button that tries to reload the app by refreshing the page"
  }))))));
}
ErrorPage.propTypes = {
  message: PropTypes.string
};
ErrorPage.defaultProps = {
  message: null
};
export default ErrorPage;
//# sourceMappingURL=ErrorPage.js.map