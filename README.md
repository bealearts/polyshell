# polyshell [![Build Status](https://travis-ci.org/bealearts/polyshell.svg)](https://travis-ci.org/bealearts/polyshell) [![Build status](https://ci.appveyor.com/api/projects/status/vrhn3q2qnqvsnl3x?svg=true)](https://ci.appveyor.com/project/DavidBeale/polyshell)
Combines Microsoft Windows and POSIX, shell scripts into a single cross platform script

## Installation
As a module
```shell
npm install polyshell --save
```

As a program
```shell
npm install polyshell -g
```

## Usage
As a module
```js
var fs = require('fs');
var polyshell = require('polyshell');

var polyshellStream = polyshell(fs.createFileStream('script.bat'), fs.createFileStream('script.sh'));
polyshellStream.pipe(fs.createWriteStream('script.cmd'));
```

As a program
```shell
polyshell script.bat script.sh > script.cmd
```

## Example

hello.bat
```bat
@echo off
echo Hello
```

hello.sh
```shell
#!/bin/sh
echo Hello
```

```shell
polyshell hello.bat hello.sh > hello.cmd
```

### On Windows
```shell
c:\project>hello.cmd
Hello

c:\project>
```

### On Linux/Unix/OSX etc
```shell
user$ chmod +x hello.cmd
user$ ./hello.cmd
Hello
user$ 
```

## Limitations
To run on as many systems as possible, the Windows script should be a Batch file, and the POSIX script should be a Bourne shell file.

When executing on POSIX systems, the script will run uisng the default shell. This is almost always the Bourne shell, however there is no guarantee that the default has not been changed!
