require('app-module-path').addPath(require('app-root-path').toString());

const HttpError = require('src/responses/HttpError.js');

/**
 * Class to provide uniform instance/formatting for system error responses
 * Alias for HttpError with set timestamp, HTTP code, internal error code
 * @module SystemError
 */
class SystemError extends HttpError {
  /**
   * @constructor
   * @param {string} message - Custom error message
   */
  constructor(message = 'System Error') {
    super(new Date(), 500, 9999, message);
  }
}

module.exports = SystemError;
