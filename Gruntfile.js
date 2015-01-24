module.exports = function(grunt) {
  grunt.initConfig({
    heroku: {
      tasks: ['browserify']
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'node-inspector', 'browserify', 'watch'],
        options: {
          limit: 4,
          logConcurrentOutput: true
        }
      }
    },
    browserify: {
      build: {
        src: ['./public/js/lobby.js'],
        dest: 'public/app/bundle.js',
        options: {
          browserifyOptions: {
            debug: true
          },
          transform: ["browserify-shim"],
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/game/*.js', 'test/events/*.js']
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug', '--stack-trace-limit=1000'],
          ignore: ['node_modules/**'],
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
        files: ['.grunt/rebooted']
      },
      app: {
        files: ['./public/js/**/*.js', './package.json'],
        tasks: ['browserify']
      }
    }
  });

  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('heroku', ['browserify']);
  grunt.registerTask('heroku:production', ['browserify']);
  grunt.registerTask('heroku:development', ['browserify']);

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-node-inspector');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
};
