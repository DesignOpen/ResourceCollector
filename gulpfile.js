var gulp = require('gulp');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');

//gulp task for production
gulp.task('prodBookmarklet', function(){
	return gulp.src('src/javascripts/bookmarklet.js') //only this file 
	.pipe(replace('localhost:4000/', 'http://osdrc.herokuapp.com/')) //replace the string
	.pipe(uglify()) //uglify result
	.pipe(gulp.dest('public/js')) //pipe into public js folder
});

//gulp task for dev
gulp.task('devBookmarklet', function(){
	return gulp.src('src/javascripts/bookmarklet.js') //only this file 
	.pipe(uglify()) //uglify result
	.pipe(gulp.dest('public/js')) //pipe into public js folder
})

gulp.task('default', ['devBookmarklet']);

gulp.task('prod', ['prodBookmarklet']);