const { checkLibrary } = require('./library');

const fs = require('fs');

module.exports.fetchLocal = function fetchLocal($path, context) {
    let from = context.path;
    $path = checkLibrary($path, from);

    console.log('Fetch : ', $path + '.dye', $path + '/index.dye')

    if (!fs.existsSync($path + '.dye')) {

        if (!fs.existsSync($path + '/index.dye'))
            throw new Error($path + ' does not exist');

        else $path += '/index.dye'

    } else $path += '.dye'

    return fs.readFileSync($path).toString();
}