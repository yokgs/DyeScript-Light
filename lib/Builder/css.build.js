let { activeStyle } = require('./active.style');

module.exports.builder = function builder(store) {

    let { css, cssmin } = require('./header').header;

    let {
        styles,
        fonts
    } = store;

    for (let el in fonts) {
        css += `\n@font-face {\n\tfont-family: ${el};\n\tsrc: url(${fonts[el].source});\n}`
        cssmin += `@font-face{font-family:${el};src:url(${fonts[el].source});}`
    }
    for (let el in styles) {
        css += `\n\n${el} {\n`;
        cssmin += `${el}{`;
        for (let p in styles[el]) {
            css += `    ${p}: ${activeStyle(styles[el][p])};\n`;
            cssmin += `${p}:${activeStyle(styles[el][p])};`;
        }
        css += `}`
        cssmin += `}`;
    }

    cssmin = cssmin.replace(/;\}/g, '}')

    return {
        css,
        cssmin
    }
}
