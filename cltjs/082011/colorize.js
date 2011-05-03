
/**
 * Wraps `data` in random terminal colors
 *
 * @param {String} data
 * @return {String}
 */

var colors = [31, 32, 33, 34, 35, 36, 37];

module.exports = exports = function (data) {
  var color = colors[Math.random() * colors.length | 0];
  var pre = '\x1B[0;' + color + 'm';
  var suf = '\x1B[0m';
  return pre + data + suf;
}
