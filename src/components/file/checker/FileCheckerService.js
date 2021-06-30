require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const TAG = '[FileCheckerService]';

const _ = require('lodash');
const fs = require('fs');

const {
    NotFoundError,
    SystemError,
    ValidationError,
} = require('src/responses');

const {
    Files,
 } = require('models/index.js');

const { FOLDER, INACTIVITY_PERIOD } = process.env;


class FileCheckerService {
    deleteInactiveFiles() {
        console.log(TAG + '[deleteInactiveFiles]');

        const files = fs.readdirSync(FOLDER);

        files.forEach((file) => {
            const path = FOLDER + '/' + file;
            const fileLastAccessedTime = fs.statSync(path).atime;

            const differenceInHours = Math.abs(new Date() - fileLastAccessedTime) / 36e5;

            if (Number(differenceInHours) >= Number(INACTIVITY_PERIOD)) {
                console.log(file + ' deleted due to inactivity.');
                fs.unlinkSync(path);
            }
        });
    }
}

module.exports = new FileCheckerService;
