'use strict';

var polyglot = require('../lib/polyglot');
var fs = require('fs');
var concat = require('concat-stream');
var expects = require('chai').expect;
var bufferEqual = require('buffer-equal');
var exec = require('child_process').exec;

fs.mkdirSync('tmp');


describe('polyglot module', function() {
	
	it('should combine Windows and POSIX scripts', function(callback) {

		var winScript = fs.createReadStream('test/artifacts/hello.bat');
		var posixScript = fs.createReadStream('test/artifacts/hello.sh');

		var polyglotStream = polyglot(winScript, posixScript);

		var concatStream = concat(onResult);

		polyglotStream.pipe(concatStream);

		function onResult(result) 
		{
			var cmdScriptBuffer = fs.readFileSync('test/artifacts/hello.cmd');
			var resultBuffer = new Buffer(result);

			expects(bufferEqual(resultBuffer, cmdScriptBuffer)).to.equal(true);

			callback();
		}

	});


	it('result should execute on Windows and POSIX platforms', function(callback) {

		var winScript = fs.createReadStream('test/artifacts/hello.bat');
		var posixScript = fs.createReadStream('test/artifacts/hello.sh');

		var polyglotStream = polyglot(winScript, posixScript);

		var result = fs.createWriteStream('tmp/hello.cmd');

		polyglotStream.pipe(result);

		polyglotStream.on('end', function(){

			if (/^win/.test(process.platform))
			{
				execute('.\\tmp\\hello.cmd', function(greeting){

					expects(greeting).to.equal('Hello\r\n');

					callback();

				});
			}
			else
			{
				fs.chmodSync('tmp/hello.cmd', '755');

				/* Work around "Text file busy" issue */
				setTimeout(function() {
					execute('tmp/hello.cmd', function(greeting){

						expects(greeting).to.equal('Hello\n');

						callback();

					});	
				}, 10);
			}

		});

	});	

});



describe('polyglot program', function() {

	it('result should execute on Windows and POSIX platforms', function(callback) {

		execute('node bin/polyglot.js test/artifacts/hello.bat test/artifacts/hello.sh > tmp/program.cmd', function() {

			if (/^win/.test(process.platform))
			{
				execute('.\\tmp\\hello.cmd', function(greeting){

					expects(greeting).to.equal('Hello\r\n');

					callback();

				});
			}
			else
			{
				fs.chmodSync('tmp/program.cmd', '755');

				/* Work around "Text file busy" issue */
				setTimeout(function() {
					execute('tmp/program.cmd', function(greeting){

						expects(greeting).to.equal('Hello\n');

						callback();

					});	
				}, 10);
			}

		});

	});	

});




function execute(command, callback)
{
    exec(command, function(error, stdout, stderr){ 
    	if (error)
    	{
    		throw error;
    	}

    	callback(stdout); 
    });
}