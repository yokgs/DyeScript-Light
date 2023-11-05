#!/usr/bin/env node

const yargs = require('yargs');
const { watcher } = require('./lib/Fetch/watch');
const { load } = require('./lib/init');

const options = yargs
  .usage('Usage: dyec -p <path> -o <path> -t <target> -w')
  .options({
    p: { alias: 'path', describe: 'The path of the file', demandOption: true, type: 'string' },
    o: { alias: 'output', describe: 'The path of the output directory', type: 'string' },
    t: {
      alias: 'target',
      describe: 'The target style',
      choices: ['r', 'a', 'c', 'm', 's'],
      description: 'r: React StyleSheet; c: CSS; m: minified CSS; s: Static DyeScript; a: All',
      type: 'string'
    },
    w: { alias: 'watch', describe: 'Watch a file', type: 'boolean' },
    debug: {
      describe: 'Show all skipped warnings and silent errors',
      type: 'boolean'
    }
  }).argv;

const { path, output, target, watch, debug } = options;

if (watch) {
  watcher(path, output, target, debug);
}

load(path, output, target, debug);