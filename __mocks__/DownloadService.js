require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const DailyLimitValidator = require('src/validators/DailyLimitValidator.js');

function _getDownloadsToday() {
    console.log('mock downloadstoday');

    return [
        { size: 0.2, createdAt: new Date(), ipAddress: '0.0.0.0' },
        { size: 0.3, createdAt: new Date(), ipAddress: '0.0.0.0' },
        { size: 0.5, createdAt: new Date(), ipAddress: '0.0.0.0' },
    ];
}

function validateDownload(file, limit) {
    // const file = { size: 0.2, ipAddress: '0.0.0.0' };

    const downloadsToday = _getDownloadsToday();
    const valid = DailyLimitValidator.validateFile(file, downloadsToday, limit);

    if (!valid) {
        return false;
    }

    return true;
}

module.exports = {
    _getDownloadsToday,
    validateDownload,
};
