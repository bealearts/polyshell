#!/usr/bin/env node

var polygot = require('../lib/polygot');
var program = require('commander');

var fs = require('fs');
var package = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8'));
 
program
  .version(package.version)
  .description(package.description)
  .usage('<windows-script-file> <posix-script-file>')
  .parse(process.argv);

if (program.args.length == 0)
{
	console.log('\nArguments <windows-script-file> <posix-script-file> are required');
	console.log(program.help());
	process.exit(1);
}
else if (program.args.length == 1)
{
	console.log('\nArgument <posix-script-file> is required');
	console.log(program.help());
	process.exit(1);
}


var winScript = fs.createReadStream(program.args[0]);
winScript.on('error', function(error){
	console.error('Error reading <windows-script-file> file:', error.path);
});

var posixScript = fs.createReadStream(program.args[1]);
posixScript.on('error', function(error){
	console.error('Error reading <posix-script-file> file:', error.path);
});

var polygotStream = polygot(winScript, posixScript);

polygotStream.pipe(process.stdout);

polygotStream.on('error', function(error){
	console.error(error);
});
