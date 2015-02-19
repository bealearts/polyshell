
'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');


gulp.task('default', ['test']);


gulp.task('clean', function(callback){
	del(['tmp'], callback);
});


gulp.task('test', ['clean', 'js'], function() {
    return gulp.src('test/*.js')
    	.pipe(plugins.mocha({reporter: 'spec'}));
});


gulp.task('js', function() {
	return gulp.src(['lib/**/*.js', 'test/**/*.js', 'gulpfile.js'])
		.pipe(plugins.jshint('.jshintrc'))
		.pipe(plugins.jshint.reporter('default'));
});

