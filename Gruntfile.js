module.exports = function(grunt) {
    grunt.initConfig({
        clean: ['coverage', 'dist', 'yarn-error.log'],
        ts: {
            default: {
                tsconfig: './tsconfig.json'
            }
        },
        copy: {
            package: {
                src: 'package.json',
                dest: 'dist/package.json',
                filter: 'isFile'
            }
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'ts', 'copy']);
};
