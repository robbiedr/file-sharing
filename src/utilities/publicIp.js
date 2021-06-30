const TAG = '[publicIp]';

const publicIp = require('public-ip');

async function getPublicIpV4() {
    console.log(TAG + '[getPublicIpV4]');

    return await publicIp.v4();
}

module.exports = {
    getPublicIpV4,
};
