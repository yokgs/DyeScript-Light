const { builder: CSSBuilder } = require('./Builder/css.build');
const { builder: ReactNativeBuilder } = require('./Builder/react.build');
const { builder: StaticDyeScriptBuilder } = require('./Builder/static.dye.build');
const { bundler } = require('./Bundle/bundler');

const { assemble } = require('./Builder/assemble');
const { fetchLocal } = require('./Fetch/fetch');
const { interpreter } = require('./Interpreter/interpreter');
const { parser } = require('./Parser/parser');
const path = require('path');
const { checkLibrary } = require('./Fetch/library');

function DyeAssembler(path, options) {
    options.from = process.cwd();
    let assembledStyles = assemble(DyeInterpreter(path, [], options));
    return assembledStyles;
}
function DyeInterpreter(path, sharedCollections, options) {
    console.log('dint', options)
    let code = fetchLocal(path, options);
    let parsedCode = parser(code, options);
    options.path = checkLibrary(path, options);
    let store = interpreter(parsedCode, sharedCollections, options);
    return store;
}

function DyeScript2CSS(assembledStyles) {
    let { css } = CSSBuilder(assembledStyles);
    console.log('Building CSS...');
    return css;
}

function DyeScript2MinCSS(assembledStyles) {
    let { cssmin } = CSSBuilder(assembledStyles);
    console.log('Building Minified CSS...');
    return cssmin;
}

function DyeScript2ReactNative(assembledStyles) {
    let { reactnative } = ReactNativeBuilder(assembledStyles);
    console.log('Building React StyleSheet...');
    return reactnative;
}
function DyeScript2StaticDyeScript(assembledStyles) {
    let { staticdye } = StaticDyeScriptBuilder(assembledStyles);
    console.log('Building Static DyeScript...');
    return staticdye;
}



// c : css ; r : react ; m : minified css ; a : all ; default : css & minified css
module.exports.load = function load($path, output = './', target = 'default', debug = false) {
    let $$time = new Date().getTime();
    let name = 'dye.compiled.';

    if (target == 'r')
        name += 'js';
    else if (target == 's')
        name += 'static.dye'
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

    const assembledStyles = DyeAssembler($path, { debug });

    if (target == 'r' || target == 'a') {
        data.push([DyeScript2ReactNative(assembledStyles), 'js']);
    }
    if (target == 'c' || target == 'a' || target == 'default') {
        data.push([DyeScript2CSS(assembledStyles), 'css']);
    }
    if (target == 'm' || target == 'a' || target == 'default') {
        data.push([DyeScript2MinCSS(assembledStyles), 'min.css']);
    }
    if (target == 's' || target == 'a') {
        data.push([DyeScript2StaticDyeScript(assembledStyles), 'static.dye']);
    }

    bundler(data, out);
    console.log('Done in ' + ((new Date()).getTime() - $$time) + ' milliseconds');
}
module.exports.DyeAssembler = DyeAssembler;
module.exports.DyeInterpreter = DyeInterpreter;
module.exports.DyeScript2CSS = DyeScript2CSS;
module.exports.DyeScript2MinCSS = DyeScript2MinCSS;
module.exports.DyeScript2ReactNative = DyeScript2ReactNative;