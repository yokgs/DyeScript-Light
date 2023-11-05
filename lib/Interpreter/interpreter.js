const variable = require("./variable");

function interpreter(code, sharedCollections, options) {
    const { store } = require("../Store/store");
    const { cache } = require("../Store/cache");
    const { DyeInterpreter } = require("../init");
    const { path, debug } = options;
console.log('op', options)

    if (cache.cached(path) && debug) {
        console.log("Using cached version of '" + path + "'")
        return cache.getCached(path)
    };

    let Store = new store(0, sharedCollections || [], options);
    let cachable = true;
    for (let i = 0; i < code.length; i++) {
        let inst = code[i].map(x => variable(x, Store));

        let cmd = inst[0];
        let r = inst[1];
        switch (cmd) {

            case '@':
            case 'set':
                for (let j = 1; j < inst.length; j += 2) {
                    Store.set(inst[j], inst[j + 1]);
                }
                break;

            case '!@':
            case '!set':
                for (let j = 1; j < inst.length; j += 2) {
                    Store.setDefault(inst[j], inst[j + 1]);
                }
                break;

            case '@keyframes':
            case '@keys':
            case '@motion':
                let isMotion = cmd === '@motion';
                console.log(cmd, isMotion)
                for (let j = 2; j < inst.length; j += 2) {
                    let s = inst[j],
                        CorS = inst[j + 1];
                    if (/^\$/.test(CorS)) {
                        Store.setAnimWithClass(r, s, CorS.slice(1), isMotion);
                    } else {
                        Store.setAnimState(r, s, CorS, inst[j + 2], isMotion);
                        j++;
                    }
                }

                break;
            case '!@':
            case '!set':
                for (let j = 1; j < inst.length; j += 2) {
                    Store.setDefault(inst[j], inst[j + 1]);
                }
                break;

            case '!type':
                Store.setType(r);
                break;
            case '!endtype':
                Store.setType('implicit');
                break;

            case '#':
            case 'collect':
                for (let j = 1; j < inst.length; j++) {
                    Store.createCollection(inst[j]);
                }
                Store.activate(r);
                break;

            case '<=':
            case 'export':
                for (let j = 1; j < inst.length; j++) {
                    Store.export(inst[j]);
                }
                break;

            case '=>':
            case 'read':
                for (let j = 1; j < inst.length; j++) {
                    Store.shared(inst[j]);
                }
                cachable = false;
                break;

            case '<<':
            case 'share':
                for (let j = 1; j < inst.length; j++) {
                    Store.share(inst[j]);
                }
                break;

            case '$':
            case 'style':

                for (let j = 2; j < inst.length; j += 2) {

                    inst[j].split(',').map(x => {
                        Store.storeStyle(r, x, inst[j + 1]);
                    });
                }
                break;
            case '+':
            case 'var':
                for (let j = 1; j < inst.length; j += 2) {
                    Store.setVariable(inst[j], inst[j + 1]);
                }
                break;

            case '.$':
            case 'class':
                for (let j = 2; j < inst.length; j += 2) {
                    inst[j].split(',').map(x => {
                        Store.storeClass(r, x, inst[j + 1]);
                    });
                }
                break;

            case '@font':
                for (let j = 1; j < inst.length; j += 2) {
                    Store.setFont(inst[j], inst[j + 1], '');
                }
                break;
            case '@media':
                Store.setMedia(inst);
                break;
            case '!orientation':
                Store.setMedia(inst);
                break;
            case '!dark':
                Store.setMedia(inst);
                break;
            case '!light':
                Store.setMedia(inst);
                break;
            case '!motionless':
                Store.setMedia(inst);
                break;
            case '!':
                Store.setMedia(inst);
                break;
            case '@@':
            case 'import':
                let ez = new store(0);
                ez = DyeInterpreter(r, Store.collectionsToShare, options);
                Store.extendsStore(ez, inst.slice(2));
                break;
            default:
                if (/\$[\w\-]+/.test(cmd)) {
                    let cl = cmd.slice(1);
                    Store.targetStyle(cl, inst.slice(1));
                }
                break;
        }
    }
    if (cachable) cache.setCache(Store, path);
    return Store;
}

module.exports.interpreter = interpreter;