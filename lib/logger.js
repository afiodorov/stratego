var logger = exports;
/**
 * current debug level
 */
logger.debugLevel = 'info';
/**
 * @param {string} level Debuggin level
 * @param {string} message Message
 */
logger.log = function(level, message) {
  var levels = ['info', 'warn', 'error'];
  var args = Array.prototype.slice.call(arguments, 2);
  if (levels.indexOf(level) >= levels.indexOf(logger.debugLevel)) {
    if (args.length !== 0) {
      console.log.call(null, level + ': ' + message, args);
    } else {
      console.log.call(null, level + ': ' + message);
    }

    //var error = new Error();
    //error.stackTraceLimit = Infinity;
    //console.log(error.stack);
  }
};
