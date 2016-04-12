'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var util = require('util');

var browserSync = require('browser-sync');

var middleware = require('./proxy');

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === paths.src || (util.isArray(baseDir) && baseDir.indexOf(paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components',
    };
  }
  
  browserSync.instance = browserSync.init(files, {
    startPath: '/',
    notify: false,
    server: {
      baseDir: baseDir,
      middleware: middleware,
      routes: routes
    },
	reloadDelay: 3000,
    browser: browser
  });
}

gulp.task('serve', ['watch'], function () {
  browserSyncInit([
    paths.tmp + '/serve',
    paths.src
  ], [
    paths.tmp + '/serve/**/*.css',
    paths.tmp + '/serve/**/*.html',
    paths.src + '/**/*.html',
    paths.src + '/**/*.js',
    paths.src + '/assets/images/**/*',
    paths.tmp + '/serve/*.html'
  ]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(paths.dist);
});
