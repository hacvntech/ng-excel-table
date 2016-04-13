'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {

  var lessOptions = {
    paths: [
      'bower_components',
      paths.src
    ]
  };

  var injectFiles = gulp.src([
    paths.src + '/**/*.less'
  ], { read: true });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(paths.src, '');
      return '@import \'' + filePath + '\';';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  var indexFilter = $.filter('index.less');

  return gulp.src([
    paths.src + '/index.less'
  ])
    .pipe(indexFilter)
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(indexFilter.restore())
    .pipe($.less())

  .pipe($.autoprefixer())
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest(paths.tmp + '/serve/'));
});
