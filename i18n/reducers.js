import { SET_LOCALE } from './actions';
import { getLocale } from './lib';

var getDefaultState = function getDefaultState() {
  return {
    locale: getLocale()
  };
};

var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getDefaultState();
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SET_LOCALE:
      return {
        locale: action.payload.locale
      };

    default:
      return state;
  }
};

export default reducer;
//# sourceMappingURL=reducers.js.map