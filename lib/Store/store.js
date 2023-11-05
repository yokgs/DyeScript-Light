const _normalize = require('../Parser/property.norm'),
    _variables = require('../Parser/css.variable');
const { collection } = require('./collections');

module.exports.store = function store(p, sharedCollections, options) {
    console.log('st', options)
    this.options = options;
    this.root = {};
    this.styles = { ":root": {} };
    this.classes = {};
    this.targets = {};
    this.fonts = {};
    this.variables = {};
    this.collections = { 'default': new collection() };
    this.scope = [];
    this.activeCollection = 'default';
    this.exportedCollections = [];
    this.sharedCollections = sharedCollections || [];
    this.collectionsToShare = [];
    this.priority = p || 0;
    this.animations = {};
    this.motions = {};
    
    console.log('st2', this.options)
    const DEBUG = this.options.debug;

    this.setAnimState = function (name, state, property, value, isMotion) {
        let STORE = isMotion ? this.motions : this.animations;
        if (!(name in STORE)) STORE[name] = {};
        if (!(state in STORE[name])) STORE[name][state] = {};
        STORE[name][state][_normalize(property)] = value;
    }
    
    this.setAnimWithClass = function (name, state, $class, isMotion) {
        let STORE = isMotion ? this.motions : this.animations;
        if (!(name in STORE)) STORE[name] = {};
        if (!(state in STORE)) STORE[name][state] = {};
        if ($class in this.classes) {
            let _class = this.classes[$class];
            for (let p in _class) {
                STORE[name][state][p] = _class[p];
            }
        }
    }

    this.setType = function (type) {
        const validTypes = ['implicit', 'color'];
        if(DEBUG && !validTypes.includes(type)){
            console.warn(`[WARN] "${type}" is not a type.`)
        }
        this.collections[this.activeCollection].setType(type);
    }

    this.set = function (name, value) {
        this.collections[this.activeCollection].set(name, value);
    }

    this.setDefault = function (name, value) {
        if (!this.collections[this.activeCollection].has(name))
            this.collections[this.activeCollection].set(name, value);
    }

    this.has = function (name) {
        return this.collections[this.activeCollection].has(name);
    }

    this.get = function (name) {
        return this.collections[this.activeCollection].get(name) || this.collections['default'].get(name);
    }

    this.export = function (name) {
        if (!(name in this.collections)){
            this.createCollection(name);
            if(DEBUG) console.warn(`[WARN] collection "${name}" does not exist. creating empty collection`)
        } 
        this.exportedCollections.push(name);
    }

    this.activate = function (name) {
        if (!(name in this.collections)) this.createCollection(name);
        this.activeCollection = name;
    }

    this.createCollection = function (name) {
        if (!(name in this.collections))
            this.collections[name] = new collection();
        else if(DEBUG) console.warn(`[WARN] trying to create existing collection "${name}"`);
    }

    this.shared = function (name) {
        this.createCollection(name);
        if (this.sharedCollections.length > 0) {
            let collection = this.sharedCollections.shift();
            this.collections[name].override(collection);
        }else if(DEBUG){
            console.warn(`[WARN] Trying to read a shared collection to ${name}. there is no shared collection`);
        }
    }

    this.share = function (name) {
        this.createCollection(name);
        this.collectionsToShare.push(this.collections[name]);
    }

    this.setVariable = function (name, value) {
        this.root[name] = value;
    }

    this.setFont = function (font, source, type = 'none') {
        this.fonts[font] = { source, type };
    }

    this.storeStyle = function (target, property, val) {

        if (!(target in this.styles))
            this.styles[target] = {};

        let nproperty = _normalize(property);

        if (!(nproperty in this.styles[target]))
            this.styles[target][nproperty] = [];

        this.styles[target][nproperty].push([_variables(val), this.priority++]);
    }

    this.storeClass = function (name, property, val) {
        let names = name.split(',');
        for (let name of names) {
            if (!(name in this.classes)) {
                this.classes[name] = {};
            }
        }
        property.split(',').map(p => {
            let norm_p = _normalize(p), value = _variables(val);
            for (let name of names) {
                this.classes[name][norm_p] = value;
            }
        });
    }

    this.targetStyle = function (name, target) {
        if (name in this.classes) {
            if (!(name in this.targets)) {
                this.targets[name] = [];
            }
            target.map(t => {
                if (/^\$[\w\W]+/.test(t)) {
                    let $class = t.slice(1);
                    if (!($class in this.classes)) {
                        this.classes[$class] = {};
                    }
                    let newClass = Object.create(this.classes[name]);
                    for (let prop in newClass) this.classes[$class][prop] = newClass[prop];
                } else this.targets[name].push([t, this.priority++]);
            });
        }
    }

    this.extendsStore = function (store, imported) {
        for (let aClass in store.classes) {
            if (!(aClass in this.classes)) {
                this.classes[aClass] = Object.create(store.classes[aClass]);
            } else {
                for (let prop in store.classes[aClass]) {
                    this.classes[aClass][prop] = store.classes[aClass][prop];
                }
            }
        }

        for (let aStyle in store.styles) {
            if (!(aStyle in this.styles)) {
                this.styles[aStyle] = {};
            }
            for (let prop in store.styles[aStyle]) {
                if (!(prop in this.styles[aStyle])) {
                    this.styles[aStyle][prop] = [];
                }
                this.styles[aStyle][prop].push(...store.styles[aStyle][prop].map(v => [v[0], v[1] + this.priority]));
            }
        }

        for (let aTarget in store.targets) {
            if (!(aTarget in this.targets)) {
                this.targets[aTarget] = [];
            }
            this.targets[aTarget].push(...store.targets[aTarget].map(v => [v[0], v[1] + this.priority]));
        }

        for (let font in store.fonts) {
            if (!(font in this.fonts)) {
                this.fonts[font] = Object.create(store.fonts[font]);
            }
        }

        for (let variable in store.root) {
            if (!(variable in this.root)) {
                this.root[variable] = store.fonts[variable];
            }
        }

        for (let collection in store.exportedCollections) {
            let current = imported[collection] || 'default';
            this.createCollection(current);
            if (current != 'default') this.collections[current].override(store.collections[store.exportedCollections[collection]]);
            else this.collections[current].extend(store.collections[store.exportedCollections[collection]]);
        }

    }

    return this;
}