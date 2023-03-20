module.exports = $ => {
    if ($ == 'true' || $ == 'false') return $;
    if (/^\-*[0-9]+\.*[0-9]*/.test($)) return $;
    return "'" + $ + "'"
}