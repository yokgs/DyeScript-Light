module.exports = (commands) => {
    let astrik = "";
    for (let i in commands) {
        if (i > 0 && commands[i][0] == "!y") {
            let operator = commands[i - 1][0];
            let validOperators = [
                '$', '.$', '@keys', '@motion',
                'style', 'class', '@keyframes'
            ];
            if (validOperators.includes(operator)) {
                commands[i].shift();
                commands[i].unshift(operator, commands[i - 1][1]);
            }
        }
        let command = commands[i];
        for (let j in command) {
            let el = command[j];
            if (el == "^" && i > 0) {
                astrik = commands[i - 1][j];
                commands[i][j] = astrik;
            }
            if (el == "<" && j > 0) {
                astrik = command[j - 1];
                commands[i][j] = astrik;
            }
            if (/\{\^\}/.test(el)) {
                astrik = commands[i - 1][j];
                commands[i][j] = el.replace(/\{\^\}/g, commands[i - 1][j]);
            }

            if (/\{\<\}/.test(el)) {
                astrik = command[j - 1];
                commands[i][j] = el.replace(/\{\^\}/g, command[j - 1]);
            }
            if (/\{\*\}/.test(el)) {
                commands[i][j] = el.replace(/\{\*\}/g, astrik);
            }
        }
    }
    return commands;
};