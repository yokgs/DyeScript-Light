module.exports.cache = {
    dyescripts: {

    },
    setCache: function(store, name){
        this.dyescripts[name] = store;
    },
    cached: function(name){
        return name in this.dyescripts;
    },
    getCached: function(name){
        return this.dyescripts[name];
    }
}