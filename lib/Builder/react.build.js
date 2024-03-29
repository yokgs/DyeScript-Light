let _common = require('./../Parser/property.short'),
    _stringify = require('./../Parser/quote.data'),
    { activeStyle } = require('./active.style');

module.exports.builder = function builder(store) {

    let { reactnative } = require('./header').header;

    let {
        styles
    } = store;

    for (let el in styles) {
        let rnss1 = '';
        if (/^\.[\w]+$/.test(el)) {
            rnss1 = `\n\t'${el.slice(1)}': {`;
        }
        for (let p in styles[el]) {
            if (/^[\w]+$/.test(_common(p)) && rnss1)
                rnss1 += `\n\t\t'${_common(p)}': ${_stringify(activeStyle(styles[el][p]))},`;
        }

        if (rnss1)
            reactnative += rnss1 + `\n\t},`;
    }

    reactnative = reactnative.slice(0, reactnative.length - 1) + '\n});';

    return { reactnative };
}
