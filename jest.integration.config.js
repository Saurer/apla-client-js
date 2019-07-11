const TEST_REGEX = '/test/.*\\.test\\.ts$';

module.exports = {
    testRegex: TEST_REGEX,
    testPathIgnorePatterns: ['<rootDir>/node_modules/'],
    moduleFileExtensions: ['js', 'ts'],
    collectCoverage: true,
    moduleDirectories: ['node_modules', 'src'],
    setupFilesAfterEnv: [
        '<rootDir>/src/setupTests.ts'
    ],
    roots: [
        '<rootDir>'
    ],
    transform: {
        "^.+\\.tsx?$": 'ts-jest'
    }
};