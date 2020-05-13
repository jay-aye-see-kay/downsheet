#!/usr/bin/env node

var fs = require('fs');

var stringify = require('./lib/stringify').stringify;
var parse = require('./lib/parse').parse;

var stdinBuffer = fs.readFileSync(0); // STDIN_FILENO = 0
var unformatted = stdinBuffer.toString();

if (unformatted) {
  var formatted = stringify(parse(unformatted));
  process.stdout.write(formatted);
}
