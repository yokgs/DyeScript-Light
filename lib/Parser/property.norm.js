module.exports = ($) => {
    $ = $ || ''
    let r = $;
    let m = [...($.match(/[A-Z]{1}/g) || [])];
    m.map(x => {
        r = r.replaceAll(x, '-' + x.toLowerCase());
    })
    return r;
}