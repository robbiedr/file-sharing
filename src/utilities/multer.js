require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const multer = require('multer');

const { FOLDER } = process.env; 
const fs = require('fs');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(FOLDER)){
            fs.mkdirSync(FOLDER);
        }
        
        cb(null, FOLDER);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, new Date().getTime() + '-' + file.originalname);
    },
});

const upload = multer({
    storage: multerStorage,
});

module.exports = upload;
