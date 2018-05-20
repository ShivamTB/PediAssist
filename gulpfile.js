var gulp = require("gulp");
var gutil = require("gulp-util");
var sass = require("gulp-sass");
var del = require("del");
var notify = require("gulp-notify");
var gulpDebug = require('gulp-debug');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('build-sass',function(){
	gulp.src('static/scss/**/*.scss')
		.pipe(sass())
		.on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(gulp.dest('static/css'))
});

gulp.task('build-index.js', function(){
	gutil.log('building minified js')
		gulp.src(['static/js/index.js', 'static/js/newpatient.js','static/js/utilities.js'])
		.pipe(gulpDebug())
        .on('error', notify.onError("Error: <%= error.message %>"))
        .pipe(concat('static/js/build/index.js'))
        .on('error', notify.onError("Error: <%= error.message %>"))
        // .pipe(uglify())
        // .on('error', notify.onError("Error: <%= error.message %>"))
        .pipe(gulp.dest('.'))
        .pipe(notify('Concat + Minified index.js'))
});

gulp.task('watch', ['build-sass'], function(){
	gulp.watch('static/scss/**/*.scss', ['build-sass']);
	gulp.watch(['static/js/index.js','static/js/newpatient.js','static/js/utilities.js'], ['build-index.js']);
});

gulp.task('default', ['watch']);