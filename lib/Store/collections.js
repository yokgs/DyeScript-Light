const { typer } = require("../Parser/evalute.type");

module.exports.collection = function collection() {

    this.variables = new Map();

    this.type = 'implicit';

    this.setType = function (type) {
        this.type = type;
    }

    this.set = function (name, value) {
        this.variables.set(name, typer(value, this.type, { key: name }));
    }

    this.get = function (name) {
        return this.variables.get(name);
    }

    this.has = function (name) {
        return this.variables.has(name);
    }

    this.extend = function ($collection) {
        $collection.variables.forEach((value, key) => {
            if (!this.variables.has(key)) {
                this.variables.set(key, value);
            }
        });
    }

    this.override = function ($collection) {
        $collection.variables.forEach((value, key) => {
            this.variables.set(key, value);
        });
    }
}
