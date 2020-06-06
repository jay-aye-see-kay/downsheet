#!/usr/bin/env node

var fs = require('fs');

var { stringify, parse, calc } = require('./build');

var stdinBuffer = fs.readFileSync(0); // STDIN_FILENO = 0
var unformatted = stdinBuffer.toString();

if (unformatted) {
  var formatted = stringify(calc(parse(unformatted)));
  process.stdout.write(formatted);
}
