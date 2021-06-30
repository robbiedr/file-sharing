require('app-module-path').addPath(require('app-root-path').toString());

const HttpError = require('src/responses/HttpError.js');
// const {compact, map} = require('lodash');

/**
 * Class to provide uniform instance/formatting for validation error responses
 * @module ValidationError
 */
class ValidationError extends HttpError {
  /**
   * @constructor
   * @param {string} message - Custom error message
   * @param {arrray} errorArr - Swagger validation errors array
   */
  constructor(message = 'Validation Error', errorArr) {
    super(new Date(), 400, 9997, message);
    this.errors = errorArr;
    // if (errorArr) {
    //   this.errors = compact(map(errorArr, (obj) => {
    //     return {
    //       errCode: obj.code,
    //       errMessage: obj.message,
    //       path: obj.path,
    //     };
    //   }));
    // }
  }
}

module.exports = ValidationError;
