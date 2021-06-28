require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const TAG = '[FileService]';

const download = require('download');
const _ = require('lodash');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');
const {
    generateHash,
    isMatched,
} = require('src/utilities/bcrypt.js');

const {
    NotFoundError,
    SystemError,
} = require('src/responses');

let files = [];

class FileService {
    uploadFile(file) {
        console.log(TAG + '[uploadFile]');

        let newFile;
        try {
            newFile = this._saveFileDetail(file);
        } catch (SaveFileError) {
            throw new SystemError('Error saving file');
        }

        return newFile;
    }

    getFile(publicKey) {
        console.log(TAG + '[getFile]' + '[' + publicKey + ']');

        const file = _.find(files, { publicKey });

        console.log(file);

        if (!file) {
            throw new NotFoundError('File not found');
        }

        return file;
    }

    deleteFile(privateKey) {
        console.log(TAG + '[deleteFile]' + '[' + privateKey + ']');

        console.log('files', files);

        let deletedFile;

        files = _.filter(files, (file) => {
            if (file.privateKey == privateKey) {
                deletedFile = file;

                return false;
            }

            return true;
        });


        if (!deletedFile) {
            throw new NotFoundError('File not found');
        }

        fs.unlinkSync(deletedFile.path);

        console.log('deleted', files);

        return files;
    }

    _saveFileDetail(file) {
        console.log(TAG + '[_saveFileDetail]');

        const publicKey = uuidv4();
        // const privateKey = await generateHash(uuidv4());
        const privateKey = uuidv4();

        const newFile = {
            ...file,
            publicKey,
            privateKey,
        };

        files.push(newFile);

        return newFile;
    }
}

module.exports = new FileService;
