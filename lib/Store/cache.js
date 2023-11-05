module.exports.cache = {
    dyescripts: new Map(),
    setCache: function(store, name){
        this.dyescripts.set(name, store);
    },
    cached: function(name){
        return this.dyescripts.has(name);
    },
    getCached: function(name){
        return this.dyescripts.get(name);
    }
}