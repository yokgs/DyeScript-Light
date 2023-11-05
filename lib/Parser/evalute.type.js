const bluedye = require("@yokgs/bluedyejs");

function typer(value, explicit, { key }) {
    if (explicit == 'color') {
        return bluedye(typer(value, 'implicit')).name(key).css();
    } else {
        if (value === 'true' || value === 'false') return value === 'true';
        if (/^[\d\-]+$/.test(value)) return parseInt(value);
        if (/^[\d\.\-]+$/.test(value)) return parseFloat(value);
        if (value === 'undefined') return undefined;
        if (value === 'null') return null;
        return value;
    }
}

module.exports.typer = typer;