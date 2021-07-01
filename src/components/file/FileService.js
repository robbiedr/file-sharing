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

const {
    validateFile,
} = require('src/validators/DailyLimitValidator.js');

/**
 * @module FileService
 */
class FileService {
    /**
     * Upload file
     * @param {object} file File to upload
     * @return {object} Uploaded file
     */
    async uploadFile(file) {
        console.log('['+ new Date() + '] ' + TAG + '[uploadFile]');
        
        file.size = Number(file.size) / 1000000;
        file.ipAddress = file.ipAddress == '::1' ? await getPublicIpV4() : file.ipAddress;

        const valid = await this._validateUpload(file, file.ipAddress);

        if (valid) {
            const newFile = await this._saveFileDetail(file);
    
            return newFile;
        }
    }

    /**
     * Get files from  DB
     * @return {array} files stored in DB
     */
    async getFiles() {
        console.log('['+ new Date() + '] ' + TAG + '[getFiles]');

        let files;
        try {
            files = await Files.find();
        } catch (DBError) {
            throw new SystemError('Database error');
        }

        return files;
    }

    /**
     * Get file for download
     * @param {string} publicKey Public key of the file to download
     * @return {object} file retrieved
     */
    async getFile(publicKey) {
        console.log('['+ new Date() + '] ' + TAG + '[getFile]' + '[' + publicKey + ']');

        let file;
        try {
            file = await Files.findOne({ publicKey });
        } catch (DBError) {
            console.log('['+ new Date() + '] ' + DBError);
            throw new SystemError('Database error');
        }

        if (!file) {
            throw new NotFoundError('File not found');
        }

        return file;
    }

    /**
     * Delete file from local storage and DB
     * @param {string} privateKey Private key of the file to delete
     * @return {object} Deleted file
     */
    async deleteFile(privateKey) {
        console.log('['+ new Date() + '] ' + TAG + '[deleteFile]' + '[' + privateKey + ']');

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

    /**
     * Save file detail to DB
     * @param {object} file File to save 
     * @return {object} Newly saved file
     */
    async _saveFileDetail(file) {
        console.log('['+ new Date() + '] ' + TAG + '[_saveFileDetail]');

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
            console.log('['+ new Date() + '] ' + DBError);
            throw new SystemError('Database error');
        }

        return newFile;
    }

    /**
     * Validate File to Daily Limit
     * @param {object} file File to validate
     * @param {string} ipAddress IP Address
     * @return {boolean} true/false
     */
    async _validateUpload(file, ipAddress) {
        const uploadsToday = await this._getUploadsToday(ipAddress);
        const valid = validateFile(file, uploadsToday, Number(UPLOAD_LIMIT));

        if (!valid) {
            fs.unlinkSync(file.path);

            throw new ValidationError('Exceeded daily upload limit. Please try again tomorrow.');
        }

        return true;
    }

    /**
     * Get uploads for today
     * @param {string} ipAddress IP Address
     * @return {array} Uploads for today
     */
    async _getUploadsToday(ipAddress) {
        let uploadsToday;
        try {
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            ipAddress = ipAddress == '::1' ? await getPublicIpV4() : ipAddress;

            uploadsToday = await Files.find({ createdAt: { $gte: startOfToday }, ipAddress });
        } catch (DBError) {
            throw new SystemError('Database Error');
        }

        return uploadsToday;
    }
}

module.exports = new FileService;
