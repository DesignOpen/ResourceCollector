var gulp = require('gulp');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var stylus = require('gulp-stylus');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var transform = require('vinyl-transform');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync');
var server = require('gulp-express');
var filter = require('gulp-filter');
var mocha = require('gulp-mocha');

var config = {
  src: {
    styles: './src/stylesheets/',
    javascript: './src/javascripts/'
  },
  dest: {
    styles: './public/stylesheets/',
    javascript: './public/javascripts/'
  }
};

gulp.task('browser-sync', ['server'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 5000,
  });
});

gulp.task('server', function () {
  server.run(['./bin/www']);
});

gulp.task('scripts', function() {
  return gulp.src([config.src.javascript+'*.js', '!./src/javascripts/form.js'])
    .pipe(replace('%HOSTNAME%', 'osdrc.herokuapp.com'))
    .pipe(gutil.env.type === 'debug' ? sourcemaps.init() : gutil.noop())
    .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(gutil.env.type === 'debug' ? sourcemaps.write('.') : gutil.noop())
    .pipe(gulp.dest(config.dest.javascript));
});

gulp.task('styles', function() {
  return gulp.src(config.src.styles+'*.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({compress: (gutil.env.type === 'production')}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dest.styles))
    .pipe(gutil.env.type === 'debug' ? filter('**/*.css') : gutil.noop())
    .pipe(gutil.env.type === 'debug' ? browserSync.reload({stream:true}) : gutil.noop());
});

gulp.task('form', function() {
  browserify(config.src.javascript+'form.js', { debug: (gutil.env.type === 'debug') })
    .transform('reactify')
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('form.js'))
    .pipe(buffer())
    .pipe(gutil.env.type === 'debug' ? gutil.noop() : uglify())
    .pipe(gulp.dest(config.dest.javascript))
    .pipe(gutil.env.type === 'debug' ? browserSync.reload({stream:true}) : gutil.noop());
});

gulp.task('test', function(){
  return gulp.src('test/*.js')
    .pipe(mocha());
});

gulp.task('build', ['styles', 'scripts', 'form']);
gulp.task('default', ['browser-sync', 'scripts', 'form', 'styles'], function(){
  gulp.watch(config.src.javascript+"**/*.js", ['form', 'scripts']);
  gulp.watch(config.src.styles+"*.styl", ['styles']);
  gulp.watch('test/*.js', ['test']);
});
