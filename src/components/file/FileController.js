require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const TAG = '[FileContoller]';

const FileService = require('src/components/file/FileService.js');
const DownloadService = require('src/components/download/DownloadService.js');

const {
    respond,
    HttpSuccess,
} = require('src/responses');

/**
 * Upload file to local storage and DB
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {object} next Next Function
 */
async function uploadFile(req, res, next) {
    console.log('['+ new Date() + '] ' + TAG + '[uploadFile]');

    const file = req.file;
    file.ipAddress = req.header('x-forwarded-for') || req.connection.remoteAddress;

    try {
        const { publicKey, privateKey } = await FileService.uploadFile(file);

        return respond(res, new HttpSuccess('Successfully uploaded', { publicKey, privateKey }));
    } catch (UploadFileError) {
        return respond(res, UploadFileError);
    }
}

/**
 * Get files from DB
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {object} next Next Function
 */
async function getFiles(req, res, next) {
    console.log('['+ new Date() + '] ' + TAG + '[getFiles]');

    try {
        const files = await FileService.getFiles();

        return respond(res, new HttpSuccess('Successfully retrieved', files));
    } catch (GetFileError) {
        return respond(res, GetFileError);
    }
}

/**
 * Get file from local storage and DB
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {object} next Next Function
 */
async function getFile(req, res, next) {
    console.log('['+ new Date() + '] ' + TAG + '[getFile]');

    const { publicKey } = req.params;


    const ipAddress = req.header('x-forwarded-for') || req.connection.remoteAddress;

    try {
        const file = await FileService.getFile(publicKey);

        const validDownload = await DownloadService.validateDownload(file, ipAddress);

        if (validDownload) {
            // DownloadService.saveDownload(file, ipAddress);

            return res.status(200).download(file.path, file.name, () => {
                console.log('['+ new Date() + '] ' + 'Successfully downloaded!', publicKey);
                DownloadService.saveDownload(file, ipAddress);
            });
        }
    } catch (GetFileError) {
        return respond(res, GetFileError);
    }
}

/**
 * Delete file from local storage and DB
 * @param {object} req Request Object
 * @param {object} res Response Object
 * @param {object} next Next Function
 */
async function deleteFile(req, res, next) {
    console.log('['+ new Date() + '] ' + TAG + '[deleteFile]');

    const { privateKey } = req.params;

    try {
        const files = await FileService.deleteFile(privateKey);

        return respond(res, new HttpSuccess('Successfully deleted'));
    } catch (DeleteFileError) {
        return respond(res, DeleteFileError);
    }

}

module.exports = {
    uploadFile,
    getFile,
    deleteFile,
    getFiles,
};
