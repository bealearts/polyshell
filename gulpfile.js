
'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();


gulp.task('default', ['test']);


gulp.task('test', ['js'], function() {
    return gulp.src('test/*.js')
    	.pipe(plugins.mocha({reporter: 'Spec'}));
});


gulp.task('js', function() {
	return gulp.src(['lib/**/*.js', 'test/**/*.js', 'gulpfile.js'])
		.pipe(plugins.jshint('.jshintrc'))
		.pipe(plugins.jshint.reporter('default'));
});

