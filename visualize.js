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


let name = '.dye'
if (options.path) {
    let r = options.path.split(/[\\|\/]+/).pop();
    let u = r.split('.');
    if (u[u.length - 1] === "dye") {
        u[u.length - 1] = 'html';
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

const _optimize = (mx) => {
    let start = 0;
    let el = '';
    for (let  i= 0; i < mx.length; i++) {
        start = 0;
        for (let j = 0; j < mx[i].length; j++) {
            let command = mx[i];
            if(/^"[\w\W]*"$/.test(command[j])){
                mx[i][j] = mx[i][j].slice(1, mx[i][j].length - 1);
            }
            else if (/^"[\w\W]*/.test(command[j])) {
                start = j;//[i, j];
            }else if (/[\w\W]*"$/.test(command[j])) {
                el = mx[i].slice(start, j+1).join(' ');
                el = el.slice(1, el.length - 1);
                console.log([...mx[i].slice(0, start), el, ...mx[i].slice(j+1)])
                mx[i] = [...mx[i].slice(0, start), el, ...mx[i].slice(j+1)];
                //j = 0;
            }
        }

    }
    return mx;
}


const _best = ps => {

    let max = 0, mi = 0;

    ps.map((x, i) => {
        if (x[0] > max) { max = x[0]; mi = i }
    })

    return ps[mi][0];
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




let styles = { ":root": {} }
let classes = {};
let targets = {};
let fonts = {};
let root0 = {};

function _compile(pathh) {
    let dye = fs.readFileSync(pathh).toString();
    let oo = _optimize(_split(dye));
    let code = _complete(oo);
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
                        let nn = _normalize(x);
                        if (!(nn in styles[r]))
                            styles[r][nn] = [];
                        styles[r][nn].push([_variables(inst[j + 1]), priority++]);
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
                            targets[cl].push([x, priority++]);
                        });
                    }
                }
                break;
        }

    }
}
//_compile(options.path);
let code =  fs.readFileSync(options.path).toString();
let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${options.path}</title>
    <style>
    /**
    Generated using DyeScript Lite 
    by Yazid Slila (@yokgs)
*/

:root {
    --cmd: #dc4545;
    --property: #367b56;
    --value: #4a4a4a;
    --text: #363636;
    --comment: #8a8a8a;
}

span {
    font-family: monospace;
    color: var(--comment);
}

span.c {
    color: var(--cmd);
    font-weight: 700;
}

span.p {
    color: var(--property);
}

span.v {
    color: var(--value);
}

span.t {
    color: var(--text);
}
</style>
</head>
<body>
    <pre>
    <span class="c">import</span> <span class="t">"I need to import"</span>
        ${code}
    </pre>
</body>
</html>/`;
/*
for (let el in fonts) {
    css += `\n@font-face {\n\tfont-family: ${el};\n\tsrc: url(${fonts[el]});\n}`
    min += `@font-face{font-family:${el};src:url(${fonts[el]});}`
}

for (let el in root0) {
    styles[':root']['--' + el] = [[root0[el], 0]];
}

console.log(styles, root0, classes, targets)

for (let el in styles) {
    css += `\n\n${el} {\n`;
    min += `${el}{`;
    for (let p in styles[el]) {
        css += `    ${p}: ${_best(styles[el][p])};\n`;
        min += `${p}:${styles[el][p]};`;
    }
    css += `}`;
    min += `}`;
}

*/
fs.writeFileSync(path.join(out, name), html);
//fs.writeFileSync(path.join(out, name.replace(/\.css$/, '.min.html')), min.replace(/;\}/g, '}'));