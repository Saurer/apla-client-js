const TEST_REGEX = '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$';

module.exports = {
    testRegex: TEST_REGEX,
    testPathIgnorePatterns: ['<rootDir>/node_modules/'],
    collectCoverage: true,
    moduleDirectories: ['node_modules', 'src'],
    roots: ['<rootDir>/src'],
    preset: 'ts-jest',
    testEnvironment: 'node'
};
