require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

jest.mock('./DownloadService.js');

const { _getDownloadsToday } = require('src/components/download/DownloadService.js');

const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

test('should return files today', () => {
    const downloadsToday = _getDownloadsToday();
    console.log('today', downloadsToday);

    const allToday = true;
    for (const download of downloadsToday) {
        const sameDay = datesAreOnSameDay(download.createdAt, new Date());

        if (!sameDay) {
            allToday = false;
            break;
        }
    }

    expect(allToday).toBe(true);
});