'use strict';

var polygot = require('../lib/polygot');
var fs = require('fs');

describe('polygot module', function(){
	
	it('should combine Windows and POSIX scripts', function(callback){

		var winScript = fs.createReadStream('test/artifacts/hello.bat');
		var posixScript = fs.createReadStream('test/artifacts/hello.sh');

		var polygotStream = polygot(winScript, posixScript);

		fs.mkdirSync('tmp');

		var result = fs.createWriteStream('tmp/hello.cmd');

		polygotStream.pipe(result)
			.on('end', callback);

	});

});