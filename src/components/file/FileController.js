require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const TAG = '[FileContoller]';

const FileService = require('src/components/file/FileService.js');

const {
    respond,
    HttpSuccess,
} = require('src/responses');

function uploadFile(req, res, next) {
    console.log(TAG + '[uploadFile]');

    const file = req.file;

    try {
        const { publicKey, privateKey } = FileService.uploadFile(file);

        return respond(res, new HttpSuccess('Successfully uploaded', { publicKey, privateKey }));
    } catch (UploadFileError) {
        return respond(res, UploadFileError);
    }
}

function getFile(req, res, next) {
    console.log(TAG + '[getFile]');

    const { publicKey } = req.params;

    try {
        const { path, filename, mimetype } = FileService.getFile(publicKey);

        return res.status(200).download(path, filename);
    } catch (GetFileError) {
        return respond(res, GetFileError);
    }
}

function deleteFile(req, res, next) {
    console.log(TAG + '[deleteFile]');

    const { privateKey } = req.params;

    try {
        const files = FileService.deleteFile(privateKey);

        return respond(res, new HttpSuccess('Successfully deleted'));
    } catch (DeleteFileError) {
        return respond(res, DeleteFileError);
    }

}

module.exports = {
    uploadFile,
    getFile,
    deleteFile,
};
