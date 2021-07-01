require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const TAG = '[DailyLimitValidator]';

const _ = require('lodash');

const {
    ValidationError,
} = require('src/responses');

/**
 * Compute total file size of downloads/uploads
 * @param {array} actions Downloads/Uploads
 * @return {number} Total file size
 */
function computeTotalSize(actions) {

    const totalSize = _.sumBy(actions, 'size');

    return totalSize;
}

/**
 * Check if value is within the limit
 * @param {number} limit Limit
 * @param {number} value Value
 * @return {boolean} true/false
 */
function checkIfWithinLimit(limit, value) {
    if (value > limit) {
        return false;
    }

    return true;
};

/**
 * Validate file
 * @param {object} file File to validate 
 * @param {array} actions Uploads/Downloads
 * @param {number} limit Limit
 * @return {boolean} true/false
 */
function validateFile(file, actions, limit) {
    const totalSize = computeTotalSize(actions);
    console.log('totalSize', totalSize);
    console.log('limit', limit);
    const valid = checkIfWithinLimit(limit, (totalSize + file.size));
    console.log('valid', valid);

    if (!valid) {
        return false;
    }

    return true;
}

module.exports = {
    computeTotalSize,
    checkIfWithinLimit,
    validateFile,
};
