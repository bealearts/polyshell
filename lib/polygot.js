'use strict';

var split = require('split');
var CombinedStream = require('combined-stream');
var through = require('through2');


module.exports = function create(winStream, posixStream)
{
	var combinedStream = CombinedStream.create();

	combinedStream.append( posixStream.pipe(split()).pipe(posixTransformStream) );

	combinedStream.append( winStream.pipe(split()).pipe(winTransformStream) );

	return combinedStream;
};



/* PRIVATE */


var posixTransformStream = through.obj(function(line, encoding, callback) {
	callback(null, ':; ' + line);
}, function(callback) {
	callback(null, ':; exit');
});



var winTransformStream = through.obj(null, function(callback) {
	callback(null, 'exit /B');
});