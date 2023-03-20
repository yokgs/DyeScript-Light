/* 
    white-space skip 
    by Yazid Slila (@yokgs)
    under Apache 2.0
*/

module.exports = ($) => {
    let $s = 0;
    let $e = '';
    for (let i = 0; i < $.length; i++) {
        $s = 0;
        for (let j = 0; j < $[i].length; j++) {
            let $c = $[i];
            if (/^"[\w\W]*"$/.test($c[j])) {
                $[i][j] = $[i][j].slice(1, $[i][j].length - 1);
            }
            else if (/^"[\w\W]*/.test($c[j])) {
                $s = j;//[i, j];
            } else if (/[\w\W]*"$/.test($c[j])) {
                $e = $[i].slice($s, j + 1).join(' ');
                $e = $e.slice(1, $e.length - 1);
                $[i] = [...$[i].slice(0, $s), $e, ...$[i].slice(j + 1)];
                j = 0;
            }
        }
    }
    return $;
}
