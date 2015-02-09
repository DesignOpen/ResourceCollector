var gulp = require('gulp');
var stylus = require('gulp-stylus');
var prefix = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var filter = require('gulp-filter');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer  = require('vinyl-buffer');
var path = require('path');
var uglify = require('gulp-uglifyjs');
var nodemon = require('gulp-nodemon');

gulp.task('css', function() {
  return gulp.src('src/stylesheets/*.styl').pipe(stylus({
    compress: true,
    sourcemap: {
      inline: true,
      sourceRoot: '.',
      basePath: 'public/stylesheets'
    }
  })).pipe(sourcemaps.init({
    loadMaps: true
  }))
  .pipe(prefix("> 1%"))
  .pipe(sourcemaps.write('./', {}))
  .pipe(gulp.dest('public/stylesheets'))
  .pipe(filter('**/*.css'));
});

gulp.task('js', function() {
  var bundler = browserify({
    entries: ['./src/javascripts/main.js'],
    debug: true,
    transform: 'reactify'
  });

  var bundle = function() {
    return bundler
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        // .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/javascripts/'));
      // .pipe(reload({stream: true}));
  };

  return bundle();
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
    files: ["public/**/*.*"],
    browser: "google chrome",
    port: 7000,
  });
});

gulp.task('nodemon', function (cb) {
  return nodemon({
    script: 'bin/www'
  }).on('start', function () {
    cb();
  });
});

gulp.task('default', ['css', 'js', 'browser-sync'], function() {
  gulp.watch('src/stylesheets/*.styl', ['css']);
  gulp.watch('src/javascripts/*.js', ['js']);
});
