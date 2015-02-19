'use strict';

var split = require('split');
var CombinedStream = require('combined-stream');
var through = require('through2');



var posixTransformStream = through.obj(function(line, encoding, callback) {

	callback(null, ':; ' + line + '\n');

}, function(callback) {

	this.push(':; exit\n');
	callback(null);

});



var winTransformStream = through.obj(function(line, encoding, callback) {
	
	callback(null, line + '\r\n');

}, function(callback) {

	this.push('exit /B\r\n');
	callback(null);

});




module.exports = function create(winStream, posixStream)
{
	var combinedStream = CombinedStream.create();

	combinedStream.append( posixStream.pipe(split()).pipe(posixTransformStream) );

	combinedStream.append( winStream.pipe(split()).pipe(winTransformStream) );

	return combinedStream;
};

