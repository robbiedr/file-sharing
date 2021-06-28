require('app-module-path').addPath(require('app-root-path').toString());

const {forEach} = require('lodash');

/**
 * Class to provide uniform instance/formatting for HTTP success responses
 * @module HttpSuccess
 */
class HttpSuccess {
  /**
   * @constructor
   * @param {string} message - Error description
   * @param {object} additionalData - Other data to be added in response
   */
  constructor(
      message = 'Operation completed successfully',
      additionalData) {
    this.timestamp = new Date();
    this.status = 200;
    this.message = message;
    this.data = additionalData;
  }
}

module.exports = HttpSuccess;
