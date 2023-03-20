const fs = require('fs');
module.exports.bundler = function bundler(data, filename) {

    for (let d of data) {
        fs.writeFileSync(filename + d[1], d[0]);
    }
}