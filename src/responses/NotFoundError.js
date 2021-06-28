require('app-module-path').addPath(require('app-root-path').toString());

const HttpError = require('src/responses/HttpError.js');
const {compact, map} = require('lodash');

/**
 * Class to provide uniform instance/formatting for not found error responses
 * @module NotFoundError
 */
class NotFoundError extends HttpError {
  /**
   * @constructor
   * @param {string} message - Custom error message
   * @param {arrray} errorArr - Swagger validation errors array
   */
  constructor(message = 'Not Found Error', errorArr) {
    super(new Date(), 404, 9997, message);
    if (errorArr) {
      this.errors = compact(map(errorArr, (obj) => {
        return {
          errCode: obj.code,
          errMessage: obj.message,
          path: obj.path,
        };
      }));
    }
  }
}

module.exports = NotFoundError;
