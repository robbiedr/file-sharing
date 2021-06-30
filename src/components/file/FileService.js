require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const TAG = '[FileService]';

const _ = require('lodash');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');
const { getPublicIpV4 } = require('src/utilities/publicIp.js');

const {
    NotFoundError,
    SystemError,
    ValidationError,
} = require('src/responses');

const {
    Files,
 } = require('models/index.js');

 const { UPLOAD_LIMIT } = process.env;


class FileService {
    async uploadFile(file) {
        console.log(TAG + '[uploadFile]');
        
        file.size = Number(file.size) / 1000000;

        const _isWithinLimit = await this._isWithinLimit(file);

        if (_isWithinLimit) {
            const newFile = await this._saveFileDetail(file);

            console.log(newFile);
    
            return newFile;
        }
    }

    async getFiles() {
        console.log(TAG + '[getFiles]');

        let files;
        try {
            files = await Files.find();
        } catch (DBError) {
            throw new SystemError('Database error');
        }

        return files;
    }

    async getFile(publicKey) {
        console.log(TAG + '[getFile]' + '[' + publicKey + ']');

        let file;
        try {
            file = await Files.findOne({ publicKey });
        } catch (DBError) {
            console.log(DBError);
            throw new SystemError('Database error');
        }

        if (!file) {
            throw new NotFoundError('File not found');
        }

        return file;
    }

    async deleteFile(privateKey) {
        console.log(TAG + '[deleteFile]' + '[' + privateKey + ']');

        let file;
        try {
            file = await Files.findOneAndDelete({ privateKey });
        } catch (DBError) {
            throw new SystemError('Database error');
        }

        if (!file) {
            throw new NotFoundError('File not found');
        }

        fs.unlinkSync(file.path);

        return file;
    }

    async _saveFileDetail(file) {
        console.log(TAG + '[_saveFileDetail]');

        const publicKey = uuidv4();
        // const privateKey = await generateHash(uuidv4());
        const privateKey = uuidv4();

        let ipAddress = file.ipAddress;
        try {
            ipAddress = ipAddress == '::1' ? await getPublicIpV4() : ipAddress;
        } catch (PublicIPError) {
            throw new SystemError('Error getting public IP address');
        }

        // file.size = Number(file.size) / 1000000;

        const newFile = {
            name: file.filename,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
            publicKey,
            privateKey,
            ipAddress,
        };

        try {
            await Files.create(newFile);
        } catch (DBError) {
            console.log(DBError);
            throw new SystemError('Database error');
        }

        const files = await Files.find();
        console.log(files);

        return newFile;
    }

    async _isWithinLimit(file) {
        console.log(TAG + '[_isWithinLimit]');

        let uploadsToday;
        try {
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            ipAddress = ipAddress == '::1' ? await getPublicIpV4() : ipAddress;
            uploadsToday = await Files.find({ createdAt: { $gte: startOfToday }, ipAddress });
        } catch (DBError) {
            throw new SystemError('Database Error');
        }

        const totalSizeToday = _.sumBy(uploadsToday, 'size');

        if ((totalSizeToday + file.size) > Number(UPLOAD_LIMIT)) {
            fs.unlinkSync(file.path);

            throw new ValidationError('Exceeded daily upload limit. Please try again tomorrow.');
        }

        return true;
    }
}

module.exports = new FileService;
