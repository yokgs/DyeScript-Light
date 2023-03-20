module.exports = (str) => {
    str = str || ''
    return str.split(/[\r\n]+/).map(x => x.replace(/,[\s]*/, ',').replace(/^[\s]{1,4}/,'!y ')
    .split(/\s/).map(d => d.replace(/_/g, ' ')));
}