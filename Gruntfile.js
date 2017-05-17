module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      development: {
        files: {
          'dist/main.css': 'src/css/main.scss',
        }
      },
    },
    concat: {
      /*
      corecss: {
        src: [
          'src/css/*.css',
        ],
        dest: 'dist/main.css'
      },
      */
      corejs: {
        src: [
          'src/js/*.js',
        ],
        dest: 'dist/main.js'
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: true,
        roundingPrecision: -1
      },
      target: {
        files: {
          'dist/main.css': ['dist/main.css'],
        }
      }
    },
    uglify: {
      corejs: {
        files: {
          'dist/main.js': ['dist/main.js']
        }
      }
    },
    watch: {
      styles: {
        files: [ // which files to watch
          'src/css/*.scss',
          'src/css/*.css',
          'src/js/*.js'
        ],
        tasks: ['default'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['sass','concat','cssmin'/*, 'uglify'*/, 'watch']);


}