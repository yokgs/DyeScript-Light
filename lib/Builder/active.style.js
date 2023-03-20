module.exports.activeStyle = function activeStyle($) {

    let max = 0, mi = 0;

    $.map((x, i) => {
        if (x[1] > max) { max = x[1]; mi = i }
    })

    return $[mi][0];
}