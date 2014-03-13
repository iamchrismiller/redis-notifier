module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    jasmine_node : {

      unit : {
        projectRoot     : ".",
        requirejs       : false,
        forceExit       : true,
        specNameMatcher : "spec"
      },

      integration : {
        projectRoot     : ".",
        requirejs       : false,
        forceExit       : true,
        specNameMatcher : "integration"
      }
    },
    jshint       : {
      options : {
        jshintrc : '.jshintrc'
      },
      task    : ['lib/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.registerTask('default', ['jshint', 'test-unit']);
  grunt.registerTask('dev', ['jshint']);
  grunt.registerTask('test', ['jasmine_node']);
  grunt.registerTask('test-unit', ['jasmine_node:unit']);
  grunt.registerTask('test-integration', ['jasmine_node:integration']);
};