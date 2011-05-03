/**
 * Module dependencies.
 */

var fs = require('fs');

/**
 * Environment vars.
 * // hack4demo
 */

var debug = profile = true;


if (debug || profile) {
  require.extensions['.js'] = function(mod, filename){
    var js = fs.readFileSync(filename, 'utf8');

    // Profiling support
    if (profile) {
      js = js.replace(/^ *\/\/ *(start|end): *([^\n]+)/gm, function(_, type, expr){
        switch (type) {
          case 'start': return 'console.time(' + expr + ');';
          case 'end': return 'console.timeEnd(' + expr + ');';
        }
      });
    }

    // Debugging
    if (debug) {
      js = js.replace(/^ *\/\/ *debug: *([^\n,]+) *([^\n]+)?/gm, function(_, fmt, args){
        return 'console.error("\033[90m  debug:\033[0m ' + fmt + '"' + (args || '') + ');';
      });
    }

    // For an April Fools joke uncomment the following:
    //js = ''

    mod._compile(js, filename);
  };
}

