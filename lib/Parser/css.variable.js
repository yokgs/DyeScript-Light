module.exports = ($) => {
    $ = $ || ''
    let r = $;
    let m = [...($.match(/\-\-[\w\-]+/g) || [])];
    m.map(x => {
        r = r.replace(x, 'var(' + x + ')');
    });
    return r;
}