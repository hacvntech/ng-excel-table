'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');
var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

gulp.task('inject', ['styles'], function () {
  var injectStyles = gulp.src([
    paths.tmp + '/serve/**/*.css'
  ], { read: false });


  var injectScripts = gulp.src([
    paths.src + '/**/*.js'
  ]).pipe($.angularFilesort());
  
  gulp.src(paths.src + '/app.js')
    .pipe(gulp.dest(paths.tmp + '/serve/'));

	$.inject.transform.html.js = function (filepath) {
	  return '<script src="' + filepath + '?v=' + (new Date).getTime() + '"></script>';
	}
	
  var injectOptions = {
    ignorePath: [paths.src, paths.tmp + '/serve'],
    addRootSlash: false,
	transform: function (filepath) {
		return $.inject.transform.apply($.inject.transform, arguments);
	}
  };

  var wiredepOptions = {
    directory: 'bower_components'
    // exclude: [/bootstrap\.js/, /bootstrap\.css/, /bootstrap\.css/, /foundation\.css/]
  };
  
  return gulp.src(paths.src + '/*.html')
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(wiredepOptions))
    .pipe(gulp.dest(paths.tmp + '/serve'));
});