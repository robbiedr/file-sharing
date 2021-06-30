require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const Files = require('models/files.js');
const Downloads = require('models/downloads.js');

module.exports = {
    Files,
    Downloads,
};
