require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const TAG = '[FileContoller]';

const FileService = require('src/components/file/FileService.js');
const DownloadService = require('src/components/download/DownloadService.js');

const {
    respond,
    HttpSuccess,
} = require('src/responses');

async function uploadFile(req, res, next) {
    console.log(TAG + '[uploadFile]');

    const file = req.file;
    file.ipAddress = req.header('x-forwarded-for') || req.connection.remoteAddress;

    try {
        const { publicKey, privateKey } = await FileService.uploadFile(file);

        return respond(res, new HttpSuccess('Successfully uploaded', { publicKey, privateKey }));
    } catch (UploadFileError) {
        return respond(res, UploadFileError);
    }
}

async function getFiles(req, res, next) {
    console.log(TAG + '[getFiles]');

    try {
        const files = await FileService.getFiles();

        return respond(res, new HttpSuccess('Successfully retrieved', files));
    } catch (GetFileError) {
        return respond(res, GetFileError);
    }
}

async function getFile(req, res, next) {
    console.log(TAG + '[getFile]');

    const { publicKey } = req.params;


    const ipAddress = req.header('x-forwarded-for') || req.connection.remoteAddress;

    console.log('123', ipAddress);

    try {
        const file = await FileService.getFile(publicKey);

        const isWithinLimit = await DownloadService.isWithinLimit(file, ipAddress);

        if (isWithinLimit) {
            DownloadService.saveDownload(file, ipAddress);

            return res.status(200).download(file.path, file.name);
        }
    } catch (GetFileError) {
        return respond(res, GetFileError);
    }
}

async function deleteFile(req, res, next) {
    console.log(TAG + '[deleteFile]');

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
