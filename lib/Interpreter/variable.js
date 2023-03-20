module.exports = function (input, store) {
    let matchedVariables = [...new Set([...input.match(/&[a-z]{1}[\w\-]*/gi) || []])];
    for (let variable of matchedVariables) {
        input = input.replaceAll(variable, store.get(variable.slice(1)) || 0);
    }
    return input;
}