const propertyShort = require('../Parser/property.short');
let { activeStyle } = require('./active.style');

module.exports.builder = function builder(store) {

    let { staticdye } = require('./header').header;

    let {
        styles,
        fonts,
        animations,
        motions
    } = store;

    for (let el in fonts) {
        staticdye += `\n@font ${el} ${fonts[el].source}`;
    }
    
    for (let el in styles) {
        staticdye += `\n$ ${el}`;
        for (let p in styles[el]) {
            staticdye += ` ${propertyShort(p)} ${activeStyle(styles[el][p])}`;
        }
    }

    for (let el in animations) {
        staticdye += `\n@key ${el}`;
        for (let s in animations[el]) {
            for (let p in animations[el][s]) {
                staticdye += ` ${s} ${propertyShort(p)} ${animations[el][s][p]}`;
            }
        }
    }
    
    for (let el in motions) {
        staticdye += `\n@motion ${el}`;
        for (let s in motions[el]) {
            for (let p in motions[el][s]) {
                staticdye += ` ${s} ${propertyShort(p)} ${motions[el][s][p]}`;
            }
        }
    }

    return {
        staticdye
    }
}
