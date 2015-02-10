var gulp = require('gulp');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var minifyCss = require('gulp-minify-css');

gulp.task('scripts-dev', function() {
	return gulp.src('src/javascripts/*.js')
    .pipe(replace('%HOSTNAME%', 'localhost:3000'))
    .pipe(gulp.dest('public/javascripts'))
});

gulp.task('scripts-prod', function() {
	return gulp.src('src/javascripts/*.js')
    .pipe(replace('%HOSTNAME%', 'osdrc.herokuapp.com'))
    .pipe(uglify())
    .pipe(gulp.dest('public/javascripts'))
});

gulp.task('styles-dev', function() {
	return gulp.src('src/stylesheets/*.css')
    .pipe(gulp.dest('public/stylesheets'))
});

gulp.task('styles-prod', function() {
	return gulp.src('src/stylesheets/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('public/stylesheets'))
});

gulp.task('dev', ['scripts-dev', 'styles-dev']);
gulp.task('prod', ['scripts-prod', 'styles-prod']);
gulp.task('default', ['dev']);