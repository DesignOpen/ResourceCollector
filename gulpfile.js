var gulp = require('gulp');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var stylus = require('gulp-stylus');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var transform = require('vinyl-transform');
var exorcist = require('exorcist');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var filter = require('gulp-filter');

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

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 5000,
  });
});

gulp.task('nodemon', function (cb) {
  return nodemon({
    script: './bin/www'
  }).on('start', function () {
      cb();
  });
});

gulp.task('bookmarklet', function() {
  return gulp.src(config.src.javascript+'bookmarklet.js')
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

gulp.task('scripts', function() {
  browserify(config.src.javascript+'form.js', { debug: (gutil.env.type === 'debug') })
    .transform('reactify')
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('form.js'))
    .pipe(buffer())
    .pipe(gutil.env.type === 'debug' ? gutil.noop() : uglify())
    .pipe(gulp.dest(config.dest.javascript));
});

gulp.task('build', ['styles', 'bookmarklet', 'scripts']);
gulp.task('default', ['bookmarklet', 'scripts', 'styles', 'browser-sync'], function(){
  gulp.watch(config.src.javascript+"*.js", ['scripts', browserSync.reload]);
  gulp.watch(config.src.styles+"*.styl", ['styles']);
});
