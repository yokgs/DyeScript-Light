const { checkLibrary } = require('./library');

const fs = require('fs');
const { load } = require('../init');
const { cache } = require('../Store/cache');

module.exports.watcher = function watcher($path, output, target) {
    let _path = $path;
    $path = checkLibrary($path);

    if (!fs.existsSync($path + '.dye')) {

        if (!fs.existsSync($path + '/index.dye'))
            throw new Error($path + ' does not exist');

        else $path += '/index.dye'

    } else $path += '.dye'

    fs.watchFile($path, () => {
        try {
            cache.dyescripts = {};
            load(_path, output, target);
        } catch (_) { console.error(_) }
    });
}