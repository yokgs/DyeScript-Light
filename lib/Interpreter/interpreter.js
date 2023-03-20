const variable = require("./variable");

function interpreter(code, sharedCollections) {

    const { store } = require("../Store/store");
    const { DyeInterpreter } = require("../init");

    let Store = new store(0, sharedCollections||[]);

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
            case '@@':
            case 'import':
                let ez = new store(0);
                ez = DyeInterpreter(r, Store.collectionsToShare);
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
    return Store;
}

module.exports.interpreter = interpreter;