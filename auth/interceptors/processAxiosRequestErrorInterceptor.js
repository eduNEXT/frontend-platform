import { getLoggingService } from '../index';
import { processAxiosError } from '../utils';

var processAxiosRequestErrorInterceptor = function processAxiosRequestErrorInterceptor(error) {
  var processedError = processAxiosError(error);
  var httpErrorStatus = processedError.customAttributes.httpErrorStatus;

  if (httpErrorStatus === 401 || httpErrorStatus === 403) {
    getLoggingService().logInfo(processedError, processedError.customAttributes);
  }

  return Promise.reject(processedError);
};

export default processAxiosRequestErrorInterceptor;
//# sourceMappingURL=processAxiosRequestErrorInterceptor.js.map