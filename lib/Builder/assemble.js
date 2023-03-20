module.exports.assemble = function assemble(store) {

    let {
        styles,
        classes,
        root,
        targets
    } = store;

    for (let i in targets) {
        let target = targets[i];
        for (let el of target) {
            let [_el, pr] = el;
            if (!(_el in styles)) {
                store.styles[_el] = {};
            }
            let s = classes[i];
            for (let p in s) {
                if (!(p in styles[_el])) {
                    store.styles[_el][p] = [];
                }
                store.styles[_el][p].push([s[p], pr]);
            }
        }
    }

    for (let el in root) {
        store.styles[':root']['--' + el] = [[root[el], 0]];
    }

    if(Object.keys(store.styles[':root']).length == 0) delete store.styles[':root'];

    return store;
}