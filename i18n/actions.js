export var SET_LOCALE = 'I18N__SET_LOCALE';
export var setLocale = function setLocale(locale) {
  return {
    type: SET_LOCALE,
    payload: {
      locale: locale
    }
  };
};
//# sourceMappingURL=actions.js.map