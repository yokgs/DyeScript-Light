const bluedye = require("@yokgs/bluedyejs");

function typer(value, explicit) {
    if (explicit == 'color') {
        return bluedye(typer(value, 'implicit')).css();
    } else {
        if (value === 'true' || value === 'false') return value === 'true';
        if (/^[\d]+/.test(value)) return parseInt(value);
        if (value === 'undefined') return undefined;
        if (value === 'null') return null;
        return value;
    }
}

module.exports.typer = typer;