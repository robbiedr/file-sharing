require('app-module-path').addPath(require('app-root-path').toString());

const HttpError = require('src/responses/HttpError');
const HttpSuccess = require('src/responses/HttpSuccess');
const SystemError = require('src/responses/SystemError');
const NotFoundError = require('src/responses/NotFoundError');
const ValidationError = require('src/responses/ValidationError');

/**
 * Respond to call
 * @param {object} res Response Object
 * @param {object} data Additional Data
 */
function respond(res, data) {
  console.log('['+ new Date() + '] ' + `[${data.status}] [${data.constructor.name}] ${data.message}`);
  res.status(data.status).send(data);
}

module.exports = {
  respond,
  HttpError,
  HttpSuccess,
  SystemError,
  NotFoundError,
  ValidationError,
};
