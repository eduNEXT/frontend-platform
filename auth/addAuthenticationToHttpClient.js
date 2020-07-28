import processAxiosRequestErrorInterceptor from './interceptors/processAxiosRequestErrorInterceptor';
import createJwtTokenProviderInterceptor from './interceptors/createJwtTokenProviderInterceptor';
import createCsrfTokenProviderInterceptor from './interceptors/createCsrfTokenProviderInterceptor';
/**
 * Adds authentication defaults and interceptors to an http client instance.
 *
 * @param {HttpClient} newHttpClient
 * @param {Object} config
 * @param {string} [config.refreshAccessTokenEndpoint]
 * @param {string} [config.accessTokenCookieName]
 * @param {string} [config.csrfTokenApiPath]
 * @returns {HttpClient} Singleton. A configured axios http client
 * @memberof module:Auth
 */

export default function addAuthenticationToHttpClient(newHttpClient, config) {
  var httpClient = Object.create(newHttpClient); // Set withCredentials to true. Enables cross-site Access-Control requests
  // to be made using cookies, authorization headers or TLS client
  // certificates. More on MDN:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials

  httpClient.defaults.withCredentials = true; // Axios interceptors
  // The JWT access token interceptor attempts to refresh the user's jwt token
  // before any request unless the isPublic flag is set on the request config.

  var refreshAccessTokenInterceptor = createJwtTokenProviderInterceptor({
    tokenCookieName: config.accessTokenCookieName,
    tokenRefreshEndpoint: config.refreshAccessTokenEndpoint,
    shouldSkip: function shouldSkip(axiosRequestConfig) {
      return axiosRequestConfig.isPublic;
    }
  }); // The CSRF token intercepter fetches and caches a csrf token for any post,
  // put, patch, or delete request. That token is then added to the request
  // headers.

  var attachCsrfTokenInterceptor = createCsrfTokenProviderInterceptor({
    csrfTokenApiPath: config.csrfTokenApiPath,
    shouldSkip: function shouldSkip(axiosRequestConfig) {
      var method = axiosRequestConfig.method,
          isCsrfExempt = axiosRequestConfig.isCsrfExempt;
      var CSRF_PROTECTED_METHODS = ['post', 'put', 'patch', 'delete'];
      return isCsrfExempt || !CSRF_PROTECTED_METHODS.includes(method);
    }
  }); // Request interceptors: Axios runs the interceptors in reverse order from
  // how they are listed. After fetching csrf tokens no longer require jwt
  // authentication, it won't matter which happens first. This change is
  // coming soon in edx-platform. Nov. 2019

  httpClient.interceptors.request.use(attachCsrfTokenInterceptor);
  httpClient.interceptors.request.use(refreshAccessTokenInterceptor); // Response interceptor: moves axios response error data into the error
  // object at error.customAttributes

  httpClient.interceptors.response.use(function (response) {
    return response;
  }, processAxiosRequestErrorInterceptor);
  return httpClient;
}
//# sourceMappingURL=addAuthenticationToHttpClient.js.map