function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'react';
import { injectIntl } from 'react-intl';
import { getLoggingService, intlShape } from './lib';

/**
 * This function wraps react-intl's injectIntl function in order to add error logging to the intl
 * property's formatMessage function.
 *
 * @memberof I18n
 */
const injectIntlWithShim = WrappedComponent => {
  class ShimmedIntlComponent extends React.Component {
    constructor(props) {
      var _this;
      super(props);
      _this = this;
      this.shimmedIntl = Object.create(this.props.intl, {
        formatMessage: {
          value: function (definition) {
            if (definition === undefined || definition.id === undefined) {
              const error = new Error('i18n error: An undefined message was supplied to intl.formatMessage.');
              if (process.env.NODE_ENV !== 'production') {
                console.error(error); // eslint-disable-line no-console
                return '!!! Missing message supplied to intl.formatMessage !!!';
              }
              getLoggingService().logError(error);
              return ''; // Fail silently in production
            }
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            return _this.props.intl.formatMessage(definition, ...args);
          }
        }
      });
    }
    render() {
      return /*#__PURE__*/React.createElement(WrappedComponent, _extends({}, this.props, {
        intl: this.shimmedIntl
      }));
    }
  }
  ShimmedIntlComponent.propTypes = {
    intl: intlShape.isRequired
  };
  return injectIntl(ShimmedIntlComponent);
};
export default injectIntlWithShim;
//# sourceMappingURL=injectIntlWithShim.js.map