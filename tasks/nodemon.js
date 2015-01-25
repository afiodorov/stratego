var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('develop', function() {
  nodemon(
  {
    script: 'server.js',
    ignore:
      [
        'node_modules/**',
        'public/**'
      ],
    nodeArgs: ['--debug', '--stack-trace-limit=1000']
  })
  .on('restart', function() {
    console.log('restarted!');
  });
});
