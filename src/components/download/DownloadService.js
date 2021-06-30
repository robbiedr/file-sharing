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

class DownloadService {
    async saveDownload(file, ipAddress) {
        console.log(TAG + '[saveDownload]');

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

    async isWithinLimit(file, ipAddress) {
        console.log(TAG + '[isWithinLimit]');

        let downloadsToday;
        try {
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            ipAddress = ipAddress == '::1' ? await getPublicIpV4() : ipAddress;
            console.log('ip', ipAddress);

            downloadsToday = await Downloads.find({ createdAt: { $gte: startOfToday }, ipAddress });

            console.log('today', downloadsToday);
        } catch (DBError) {
            throw new SystemError('Database Error');
        }

        const totalSizeToday = _.sumBy(downloadsToday, 'size');

        if ((totalSizeToday + file.size) > Number(DOWNLOAD_LIMIT)) {
            throw new ValidationError('Exceeded daily download limit. Please try again tomorrow.');
        }

        return true;
    }
}

module.exports = new DownloadService;
