const path = require('path');
module.exports.checkLibrary = function checkLibrary($path) {
    if (/^<[\w\-\.]+>$/.test($path)) {
        return path.join(__dirname, '../../dye.rectory/' + $path.slice(1, $path.length - 1));
    }
    return path.join(process.cwd(), $path);
}