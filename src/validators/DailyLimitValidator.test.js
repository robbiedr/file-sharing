require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const DailyLimitValidator = require('src/validators/DailyLimitValidator.js');

test('should return true -> checkIfWithinLimit(1, 0.5)', () => {
    const isWithinLimit = DailyLimitValidator.checkIfWithinLimit(1, 0.5);
    expect(isWithinLimit).toBe(true);
});

test('should return false -> checkIfWithinLimit(1, 2)', () => {
    const isWithinLimit = DailyLimitValidator.checkIfWithinLimit(1, 2);
    expect(isWithinLimit).toBe(false);
});

test('should return 1 -> computeTotalSize(0.5, 0.2, 0.3)', () => {
    const actions = [
        { size: 0.5 }, { size: 0.2 }, { size: 0.3 }
    ];

    const totalSize = DailyLimitValidator.computeTotalSize(actions);

    expect(totalSize).toBe(1);
});

test('should return true', () => {
    const file = { size: 0.2 };
    const actions = [
        { size: 0.5 }, { size: 0.3 }
    ];
    const limit = 2;

    const validFile = DailyLimitValidator.validateFile(file, actions, limit);

    expect(validFile).toBe(true);
});

test('should return false', () => {
    const file = { size: 0.2 };
    const actions = [
        { size: 0.5 }, { size: 1.3 }
    ];
    const limit = 1;

    const validFile = DailyLimitValidator.validateFile(file, actions, limit);

    expect(validFile).toBe(false);
});
