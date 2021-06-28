require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const express = require('express');
const router = express.Router();

const FileController = require('src/components/file/FileController.js');
const upload = require('src/utilities/multer.js');

router.post('/', upload.single('file'), FileController.uploadFile);
router.get('/:publicKey', FileController.getFile);
router.delete('/:privateKey', FileController.deleteFile);

module.exports = router;
