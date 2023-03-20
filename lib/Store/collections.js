const { typer } = require("../Parser/evalute.type");

module.exports.collection = function collection() {

    this.variables = {};

    this.type = 'implicit';

    this.setType = function (type) {
        this.type = type;
    }

    this.set = function (name, value) {
        this.variables[name] = typer(value, this.type);
    }

    this.get = function (name) {
        return this.variables[name];
    }

    this.has = function (name) {
        return this.variables[name] !== undefined;
    }

    this.extend = function ($collection) {
        for (let name in $collection.variables) {
            if (!(name in this.variables)) {
                this.variables[name] = $collection.variables[name]
            }
        }
    }

    this.override = function ($collection) {
        console.log($collection)
        for (let name in $collection.variables) {
            this.variables[name] = $collection.variables[name]
        }
    }
}
