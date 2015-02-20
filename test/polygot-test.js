'use strict';

var polygot = require('../lib/polygot');
var fs = require('fs');
var concat = require('concat-stream');
var expects = require('chai').expect;
var bufferEqual = require('buffer-equal');
var exec = require('child_process').exec;

fs.mkdirSync('tmp');


describe('polygot module', function() {
	
	it('should combine Windows and POSIX scripts', function(callback) {

		var winScript = fs.createReadStream('test/artifacts/hello.bat');
		var posixScript = fs.createReadStream('test/artifacts/hello.sh');

		var polygotStream = polygot(winScript, posixScript);

		var concatStream = concat(onResult);

		polygotStream.pipe(concatStream);

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

		var polygotStream = polygot(winScript, posixScript);

		var result = fs.createWriteStream('tmp/hello.cmd');

		polygotStream.pipe(result);

		polygotStream.on('end', function(){

			if (/^win/.test(process.platform))
			{
				execute('.\\tmp\\hello.cmd', function(greeting){

					expects(greeting).to.equal('Hello\r\n');

					callback();

				});
			}
			else
			{
				fs.chmod('tmp/hello.cmd', '755', function(){
					execute('tmp/hello.cmd', function(greeting){

						expects(greeting).to.equal('Hello\n');

						callback();

					});					
				});
			}

		});

	});	

});



describe('polygot program', function() {

	it('result should execute on Windows and POSIX platforms', function(callback) {

		execute('node bin/polygot.js test/artifacts/hello.bat test/artifacts/hello.sh > tmp/program.cmd', function() {

			if (/^win/.test(process.platform))
			{
				execute('.\\tmp\\hello.cmd', function(greeting){

					expects(greeting).to.equal('Hello\r\n');

					callback();

				});
			}
			else
			{
				fs.chmod('tmp/program.cmd', '755', function(){
					execute('tmp/program.cmd', function(greeting){

						expects(greeting).to.equal('Hello\n');

						callback();

					});					
				});
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