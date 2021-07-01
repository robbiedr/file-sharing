const TAG = '[publicIp]';

const publicIp = require('public-ip');

/**
 * Get Public IP Address
 * @return {string} Public IP Address
 */
async function getPublicIpV4() {
    console.log(TAG + '[getPublicIpV4]');

    return await publicIp.v4();
}

module.exports = {
    getPublicIpV4,
};
