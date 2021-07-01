require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const TAG = '[DownloadService]';

const { DOWNLOAD_LIMIT } = process.env;

const _ = require('lodash');

const { getPublicIpV4 } = require('src/utilities/publicIp.js');

const {
    SystemError,
    ValidationError,
} = require('src/responses');

const {
    Files,
    Downloads,
 } = require('models/index.js');

const {
    validateFile,
} = require('src/validators/DailyLimitValidator.js');

/**
 * @module DownloadService
 */
class DownloadService {

    /**
     * Save Download Record to DB
     * @param {object} file File object
     * @param {string} ipAddress IP Address
     */
    async saveDownload(file, ipAddress) {
        console.log(TAG + '[saveDownload]');

        ipAddress = ipAddress == '::1' ? await getPublicIpV4() : ipAddress;

        const {
            name: filename,
            path,
            mimetype,
            size,
        } = file;

        try {
            await Downloads.create({
                filename,
                path,
                mimetype,
                ipAddress,
                size,
            });

            console.log('Download detail saved');
        } catch (DBError) {
            console.log(DBError);
            throw new SystemError('Database Error');
        }
    }

    // async isWithinLimit(file, ipAddress) {
    //     console.log(TAG + '[isWithinLimit]');

    //     let downloadsToday;
    //     try {
    //         const now = new Date();
    //         const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    //         ipAddress = ipAddress == '::1' ? await getPublicIpV4() : ipAddress;
    //         console.log('ip', ipAddress);

    //         downloadsToday = await Downloads.find({ createdAt: { $gte: startOfToday }, ipAddress });

    //         console.log('today', downloadsToday);
    //     } catch (DBError) {
    //         throw new SystemError('Database Error');
    //     }

    //     const totalSizeToday = _.sumBy(downloadsToday, 'size');

    //     const _isWithinLimit = this._isWithinLimit((totalSizeToday + file.size), Number(DOWNLOAD_LIMIT));

    //     if (!_isWithinLimit) {
    //         throw new ValidationError('Exceeded daily download limit. Please try again tomorrow.');
    //     }

    //     return true;
    // }

    /**
     * Validate Download to Daily Limit
     * @param {object} file File object
     * @param {string} ipAddress IP Address
     * @return {boolean} true/false
     */
    async validateDownload(file, ipAddress) {
        ipAddress = ipAddress == '::1' ? await getPublicIpV4() : ipAddress;
        const downloadsToday = await this._getDownloadsToday(ipAddress);
        console.log(ipAddress, downloadsToday);
        const valid = validateFile(file, downloadsToday, Number(DOWNLOAD_LIMIT));

        if (!valid) {
            throw new ValidationError('Exceeded daily download limit. Please try again tomorrow.');
        }

        return true;
    }

    /**
     * Get all downloads for today
     * @param {string} ipAddress IP Address
     * @return {array} Downloads for Today
     */
    async _getDownloadsToday(ipAddress) {
        console.log(new Date(), TAG + '[deleteInactiveFiles][' + ipAddress + ']');

        let downloadsToday;
        try {
            const now = new Date();
            console.log('now', now);
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            ipAddress = ipAddress == '::1' ? await getPublicIpV4() : ipAddress;
            console.log('ip', ipAddress);
            console.log(startOfToday);

            downloadsToday = await Downloads.find({ createdAt: { $gte: startOfToday }, ipAddress });

            console.log('today', downloadsToday);
        } catch (DBError) {
            throw new SystemError('Database Error');
        }

        return downloadsToday;
    }

    /**
     * Compute total download size for today
     * @param {array} downloadsToday Downloads for today 
     * @return {boolean} true/false
     */
    _computeTotalDownloadsToday(downloadsToday) {

        const totalSizeToday = _.sumBy(downloadsToday, 'size');

        return totalSizeToday;
    }

    _isWithinLimit(limit, value) {
        if (value > limit) {
            return false;
        }

        return true;
    }
}

module.exports = new DownloadService;
