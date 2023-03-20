#!/usr/bin/env node
const yargs = require("yargs");
const { load } = require("./init");
const options = yargs
    .usage("Usage: -p <path>")
    .option("p", { alias: "path", describe: "The path of the file", type: "string", demandOption: true })
    .usage("Usage: -o <path>")
    .option("o", { alias: "output", describe: "The path of the output directory", type: "string", demandOption: false })
    .usage("Usage: -t <path>")
    .option("t", { alias: "target", describe: "The target style", type: "string", demandOption: false })
    .argv;
const { path, output, target } = options;
load(path, output, target);
