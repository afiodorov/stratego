module.exports = function(grunt) {
  grunt.initConfig({
    concurrent: {
      dev: {
        tasks: ['nodemon', 'node-inspector', 'browserify', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    browserify: {
      build: {
        dist: {
          files: {
            'public/app/bundle.js': ['public/js/**/*.js']
          }
        },
        options: {
          shim: {
            jquery: {
              path: './public/vendor/jquery.min.js',
              exports: '$'
            },
            'jquery-ui': {
              path: './public/vendor/jquery-ui.min.js',
              depends: {
                jquery: '$'
              }
            },
            pnotify: {
              path: './public/vendor/pnotify/jquery.pnotify.min.js',
              exports: '$.pnotify'
            },
            knockout: {
              path: './public/vendor/knockout-2.2.1.js',
              exports: 'ko',
              depends: {
                  jquery: '$'
              }
            },
            'knockout-jquery' : {
               path: './public/vendor/knockout-jqueryui.min.js',
               depends: {
                 knockout : 'knockout'
              }
            }
          }
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ignore: ['node_modules/**', 'public/**'],
          env: {
          },
          // omit this property if you aren't serving HTML files and 
          // don't want to open a browser tab on start
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              // Delay before server listens on port
              setTimeout(function() {
                require('open')('http://localhost:5000');
              }, 1000);
            });

            // refreshes browser when server reboots
            nodemon.on('restart', function () {
              // Delay before server listens on port
              setTimeout(function() {
                require('fs').writeFileSync('.grunt/rebooted', 'rebooted');
              }, 1000);
            });
          }
        }
      }
    },
    'node-inspector': {
      dev: {}
    },
    watch: {
      server: {
        files: ['.grunt/rebooted'],
        options: {
          livereload: true
        }
      }, 
      app: {
        files: './public/js/**/*.js',
        tasks: ['browserify']
      }
    }
  });

  grunt.registerTask('default', ['concurrent']);  

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-node-inspector');
  grunt.loadNpmTasks('grunt-contrib-watch'); 
  grunt.loadNpmTasks('grunt-contrib-livereload');
};
