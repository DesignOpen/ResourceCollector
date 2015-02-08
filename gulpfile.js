var gulp = require('gulp');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');

//gulp task for production
gulp.task('prod', function(){
	return gulp.src(['bookmarklet.js']) //only this file 
	.pipe(replace('localhost:4000/', 'http://osdrc.herokuapp.com/')) //replace the string
	.pipe(uglify()) //uglify result
	.pipe(gulp.dest('public/javascripts')) //pipe into public js folder
});

//gulp task for dev
gulp.task('dev', function(){
	return gulp.src(['bookmarklet.js']) //only this file 
	.pipe(uglify()) //uglify result
	.pipe(gulp.dest('public/javascripts')) //pipe into public js folder
})

gulp.task('default', ['dev']);