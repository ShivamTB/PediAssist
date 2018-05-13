var gulp = require("gulp");
var gutil = require("gulp-util");
var sass = require("gulp-sass");
var del = require("del");	
var notify = require("gulp-notify");

gulp.task('build-sass',function(){
	gulp.src('static/scss/**/*.scss')
		.pipe(sass())
		.on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(gulp.dest('static/css'))
});


gulp.task('watch', ['build-sass'], function(){
	gulp.watch('static/scss/**/*.scss', ['build-sass']);
});