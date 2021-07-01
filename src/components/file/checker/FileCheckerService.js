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

/**
 * @module FileCheckerService
 */
class FileCheckerService {
    /**
     * Delete all inactive files
     */
    async deleteInactiveFiles() {
        console.log(TAG + '[deleteInactiveFiles]');

        const files = fs.readdirSync(FOLDER);

        let inactiveFiles = [];
        files.forEach((file) => {
            const path = FOLDER + '/' + file;
            const fileLastAccessedTime = fs.statSync(path).atime;

            const differenceInHours = Math.abs(new Date() - fileLastAccessedTime) / 36e5;

            if (Number(differenceInHours) >= Number(INACTIVITY_PERIOD)) {
                console.log(file + ' deleted due to inactivity.');
                fs.unlinkSync(path);

                inactiveFiles.push(file);

                // const deletedFile = await Files.findOneAndDelete({ name: file });

                // console.log('deleted', deletedFile);
            }
        });

        const deletedFiles = await Files.deleteMany({ name: { $in: inactiveFiles } });
        console.log('deleted files', deletedFiles.deletedCount);
    }
}

module.exports = new FileCheckerService;
