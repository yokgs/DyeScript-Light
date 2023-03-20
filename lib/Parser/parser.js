const _optimize = require('./ws.skip'),
    _split = require("./split"),
    _complete = require("./complete");

module.exports.parser = function parser(dye) {
    let tokens = _optimize(_split(dye));
    let code = _complete(tokens);
    return code;
}