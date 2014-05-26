module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify2: {
            client: {
                entry: "./js/main.js",
                compile: "./bin/lowrez.js"
            },
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            client: {
                src: 'bin/lowrez.js',
                dest: 'bin/lowrez.min.js'
            }
        },
        jshint: {
            all: [
                "js/**/*.js",
                "!js/physics.js"
            ]
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify2');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'browserify2', 'uglify']);
};
