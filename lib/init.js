const { builder: CSSBuilder } = require('./Builder/css.build');
const { builder: ReactNativeBuilder } = require('./Builder/react.build');
const { bundler } = require('./Bundle/bundler');

const { assemble } = require('./Builder/assemble');
const { fetchLocal } = require('./Fetch/fetch');
const { interpreter } = require('./Interpreter/interpreter');
const { parser } = require('./Parser/parser');
const path = require('path');
function DyeAssembler(path) {
    let assembledStyles = assemble(DyeInterpreter(path));
    return assembledStyles;
}
function DyeInterpreter(path) {
    let code = fetchLocal(path);
    let parsedCode = parser(code);
    let store = interpreter(parsedCode);
    return store;
}

function DyeScript2CSS(assembledStyles) {
    let { css } = CSSBuilder(assembledStyles);
    return css;
}

function DyeScript2MinCSS(assembledStyles) {
    let { cssmin } = CSSBuilder(assembledStyles);
    return cssmin;
}

function DyeScript2ReactNative(assembledStyles) {
    let { reactnative } = ReactNativeBuilder(assembledStyles);
    return reactnative;
}



// c : css ; r : react ; m : minified css ; a : all ; default : css & minified css
module.exports.load = function load($path, output = './', target = 'default') {

    let name = 'dye.compiled.';

    if (target == 'r')
        name += 'js';
    else
        name += 'css';

    if ($path) {
        let file = ($path + '.dye').split(/[\\|\/]+/).pop();
        let u = file.split('.');
        if (u[u.length - 1] === "dye") {
            u[u.length - 1] = '';
        } else {
            u.push('');
        }
        name = u.join('.');
    }
    let out = path.join(output || './', name);

    let data = [];

    const assembledStyles = DyeAssembler($path);

    if (target == 'r' || target == 'a') {
        data.push([DyeScript2ReactNative(assembledStyles), 'js']);
    }
    if (target == 'c' || target == 'a' || target == 'default') {
        data.push([DyeScript2CSS(assembledStyles), 'css']);
    }
    if (target == 'm' || target == 'a' || target == 'default') {
        data.push([DyeScript2MinCSS(assembledStyles), 'min.css']);
    }

    bundler(data, out);

}
module.exports.DyeAssembler = DyeAssembler;
module.exports.DyeInterpreter = DyeInterpreter;
module.exports.DyeScript2CSS = DyeScript2CSS;
module.exports.DyeScript2MinCSS = DyeScript2MinCSS;
module.exports.DyeScript2ReactNative = DyeScript2ReactNative;