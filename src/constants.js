/** @constant */
export const APP_TOPIC = 'APP';

export const APP_PUBSUB_INITIALIZED = `${APP_TOPIC}.PUBSUB_INITIALIZED`;

/**
 * Event published when the application initialization sequence has finished loading any dynamic
 * configuration setup in a custom config handler.
 *
 * @event
 */
export const APP_CONFIG_INITIALIZED = `${APP_TOPIC}.CONFIG_INITIALIZED`;

/**
 * Event published when the application initialization sequence has finished determining the user's
 * authentication state, creating an authenticated API client, and executing auth handlers.
 *
 * @event
 */
export const APP_AUTH_INITIALIZED = `${APP_TOPIC}.AUTH_INITIALIZED`;

/**
 * Event published when the application initialization sequence has finished initializing
 * internationalization and executing any i18n handlers.
 *
 * @event
 */
export const APP_I18N_INITIALIZED = `${APP_TOPIC}.I18N_INITIALIZED`;

/**
 * Event published when the application initialization sequence has finished initializing the
 * logging service and executing any logging handlers.
 *
 * @event
 */
export const APP_LOGGING_INITIALIZED = `${APP_TOPIC}.LOGGING_INITIALIZED`;

/**
 * Event published when the application initialization sequence has finished initializing the
 * analytics service and executing any analytics handlers.
 *
 * @event
 */
export const APP_ANALYTICS_INITIALIZED = `${APP_TOPIC}.ANALYTICS_INITIALIZED`;

/**
 * Event published when the application initialization sequence has finished.  Applications should
 * subscribe to this event and start rendering the UI when it has fired.
 *
 * @event
 */
export const APP_READY = `${APP_TOPIC}.READY`;

/**
 * Event published when the application initialization sequence has aborted.  This is frequently
 * used to show an error page when an initialization error has occurred.
 *
 * @see {@link module:React~ErrorPage}
 * @event
 */
export const APP_INIT_ERROR = `${APP_TOPIC}.INIT_ERROR`;

/** @constant */
export const CONFIG_TOPIC = 'CONFIG';

export const CONFIG_CHANGED = `${CONFIG_TOPIC}.CHANGED`;

export const PRIMARY_COLOR_DEFINITIONS = {
  'pgn-color-primary-100': { '#FFFFFF': 94 },
  'pgn-color-primary-200': { '#FFFFFF': 75 },
  'pgn-color-primary-300': { '#FFFFFF': 50 },
  'pgn-color-primary-400': { '#FFFFFF': 25 },
  'pgn-color-primary-500': { '#FFFFFF': 0 },
  'pgn-color-primary-600': { '#000000': 10 },
  'pgn-color-primary-700': { '#000000': 20 },
  'pgn-color-primary-800': { '#000000': 25 },
  'pgn-color-primary-900': { '#000000': 30 },
  'pgn-color-link-base': { '#FFFFFF': 35 },
  'pgn-color-link-hover': { '#FFFFFF': 0 },
};
