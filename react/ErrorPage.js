function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React, { Component } from 'react';
import { Button } from '@edx/paragon';
import { FormattedMessage } from '../i18n';
/**
 * An error page that displays a generic message for unexpected errors.  Also contains a "Try
 * Again" button to refresh the page.
 *
 * @memberof module:React
 * @extends {Component}
 */

var ErrorPage =
/*#__PURE__*/
function (_Component) {
  _inherits(ErrorPage, _Component);

  function ErrorPage() {
    _classCallCheck(this, ErrorPage);

    return _possibleConstructorReturn(this, _getPrototypeOf(ErrorPage).apply(this, arguments));
  }

  _createClass(ErrorPage, [{
    key: "reload",

    /* istanbul ignore next */
    value: function reload() {
      global.location.reload();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "container-fluid py-5 justify-content-center align-items-start text-center"
      }, React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col"
      }, React.createElement("p", {
        className: "my-0 py-5 text-muted"
      }, React.createElement(FormattedMessage, {
        id: "unexpected.error.message.text",
        defaultMessage: "An unexpected error occurred. Please click the button below to refresh the page.",
        description: "error message when an unexpected error occurs"
      })))), React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col"
      }, React.createElement(Button, {
        buttonType: "primary",
        onClick: this.reload,
        label: React.createElement(FormattedMessage, {
          id: "unexpected.error.button.text",
          defaultMessage: "Try Again",
          description: "text for button that tries to reload the app by refreshing the page"
        })
      }))));
    }
  }]);

  return ErrorPage;
}(Component);

export default ErrorPage;
//# sourceMappingURL=ErrorPage.js.map