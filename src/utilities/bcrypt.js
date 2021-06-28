require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const TAG = '[bcrypt]';

const bcrypt = require('bcrypt');

async function generateHash(text) {
    console.log(TAG + '[generateHash]');
    const saltRounds = 10;

    return await bcrypt.hash(text, saltRounds);
}

async function isMatched(text, hash) {
    console.log(TAG + '[isMatched]');

    return await bcrypt.compare(text, hash);
}

module.exports = {
    generateHash,
    isMatched,
};
