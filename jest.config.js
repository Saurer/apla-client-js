const TEST_REGEX = '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$';

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
        '<rootDir>/src'
    ],
    transform: {
        "^.+\\.tsx?$": 'ts-jest'
    }
};