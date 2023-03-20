module.exports = ($) => {
    $ = $ || ''
    let r = $;
    let m = [...($.match(/\-[a-z]{1}/g) || [])];
    m.map(x => {
        r = r.replace(x, x.slice(1).toUpperCase());
    })
    return r;
}