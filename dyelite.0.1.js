#!/usr/bin/env node

let fs = require("fs");
let path = require("path");

const yargs = require("yargs");
const origin = process.cwd();
const options = yargs
    .usage("Usage: -p <path>")
    .option("p", { alias: "path", describe: "The path of the file", type: "string", demandOption: true })
    .usage("Usage: -o <path>")
    .option("o", { alias: "output", describe: "The path of the output directory", type: "string", demandOption: false })
    .argv;


let name = 'dye.compiled.css'
if (options.path) {
    let r = options.path.split(/[\\|\/]+/).pop();
    let u = r.split('.');
    if (u[u.length - 1] === "dye") {
        u[u.length - 1] = 'css';
    }
    name = u.join('.');
}
let out = options.output || './';
let priority = 0;
const _complete = (commands) => {
    let astrik = "";
    for (let i in commands) {
        let command = commands[i];
        for (let j in command) {
            let el = command[j];
            if (el == "^" && i > 0) {
                astrik = commands[i - 1][j];
                commands[i][j] = astrik;
            }
            if (el == "<" && j > 0) {
                astrik = command[j - 1];
                commands[i][j] = astrik;
            }
            if (/\{\^\}/.test(el)) {
                astrik = commands[i - 1][j];
                commands[i][j] = el.replace(/\{\^\}/g, commands[i - 1][j]);
            }

            if (/\{\<\}/.test(el)) {
                astrik = command[j - 1];
                commands[i][j] = el.replace(/\{\^\}/g, command[j - 1]);
            }
            if (/\{\*\}/.test(el)) {
                commands[i][j] = el.replace(/\{\*\}/g, astrik);
            }
        }
    }
    return commands;
}
const _split = (str) => {
    str = str || ''
    return str.split(/[\r\n]+/).map(x => x.trim().split(/[\s]+/).map(d => d.replace(/_/g, ' ')));
}

const _normalize = (str) => {
    str = str || ''
    let r = str;
    let m = [...(str.match(/[A-Z]+/g) || [])];
    m.map(x => {
        r = r.replace(x, '-' + x);
    })
    return r.toLowerCase();
}

const _variables = (str) => {
    str = str || ''
    let r = str;
    let m = [...(str.match(/\-\-[\w\-]+/g) || [])];
    m.map(x => {
        r = r.replace(x, 'var(' + x + ')');
    });
    return r;
}




let styles = {":root":{}}
let classes = {};
let targets = {};
let fonts = {};
let root0 = {};

function _compile(pathh) {
    let dye = fs.readFileSync(pathh).toString();
    let code = _complete(_split(dye));
    for (let i = 0; i < code.length; i++) {

        let inst = code[i];
        let cmd = inst[0];
        let r = inst[1];
        switch (cmd) {
            case '$':
            case 'style':
                if (!(r in styles)) {
                    styles[r] = {};
                }
                for (let j = 2; j < inst.length; j += 2) {
                    inst[j].split(',').map(x => {
                        styles[r][_normalize(x)] = _variables(inst[j + 1]);
                    });
                }
                break;
            case '+':
            case 'var':
                for (let j = 1; j < inst.length; j += 2) {
                    root0[inst[j]] = inst[j + 1];
                }
                break;
            case '.$':
            case 'class':
                if (!(r in classes)) {
                    classes[r] = {};
                }
                for (let j = 2; j < inst.length; j += 2) {
                    inst[j].split(',').map(x => {
                        classes[r][_normalize(x)] = _variables(inst[j + 1]);
                    });
                }
                break;
            case '@font':
                for (let j = 1; j < inst.length; j += 2) {
                    fonts[inst[j]] = inst[j + 1]
                }
                break;
            case '@@':
            case 'import':
                _compile(r);
                break;
            default:
                if (/\$[\w\-]+/.test(cmd)) {
                    let cl = cmd.split(/\$/)[1];
                    if (cl in classes) {
                        if (!(cl in targets)) {
                            targets[cl] = [];
                        }
                        inst.slice(1).map(x => {
                            targets[cl].push(x);
                        });
                    }
                }
                break;
        }

    }
}
_compile(options.path);
for (let i in targets) {
    let t = targets[i];
    for (let el of t) {
        if (!(el in styles)) {
            styles[el] = {};
        }
        let s = classes[i];
        for (let p in s) {
            styles[el][p] = s[p];
        }
    }
}

let css = `/**
    Generated using DyeScript Lite 
    by Yazid Slila (@yokgs)
*/`, min = `/** Generated using DyeScript Lite 
by Yazid Slila (@yokgs) */\n`;

for (let el in fonts) {
    css += `\n@font-face {\n\tfont-family: ${el};\n\tsrc: url(${fonts[el]});\n}`
    min += `@font-face{font-family:${el};src:url(${fonts[el]});}`
}

for (let el in root0) {
   styles[':root']['--'+el] = root0[el];
}

for (let el in styles) {
    css += `\n\n${el} {\n`;
    min += `${el}{`;
    for (let p in styles[el]) {
        css += `    ${p}: ${styles[el][p]};\n`;
        min += `${p}:${styles[el][p]};`;
    }
    css += `}`
    min += `}`;
}


fs.writeFileSync(path.join(out, name), css);
fs.writeFileSync(path.join(out, name.replace(/\.css$/, '.min.css')), min.replace(/;\}/g, '}'));