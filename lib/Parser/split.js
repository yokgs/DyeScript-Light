module.exports = (str) => {
    str = str || ''
    return str.split(/[\r\n]+/).map(x => x.replace(/,[\s]*/, ',').split(/[\s]+/).map(d => d.replace(/_/g, ' ')));
}