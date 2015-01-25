var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');

var entryFile = './public/ts/index.ts';
var bundleFile = './public/app/bundle.js';

function bundleShare(b) {
  b.bundle()
    .pipe(source(entryFile))
    .pipe(rename(bundleFile))
    .pipe(gulp.dest('.'));
}

function browserifyShare() {
  var b = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true
  });

  b = watchify(b);

  b.transform(require('browserify-shim'));
  b.plugin(require('tsify'));

  b.on('update', function() {
    bundleShare(b);
  });

  b.add(entryFile);
  bundleShare(b);
}

gulp.task('watchify', function() {
  browserifyShare();
});
