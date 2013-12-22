var logger = exports;
logger.debugLevel = 'info';
logger.log = function(level, message) {
  var levels = ['error', 'warn', 'info'];
  var args = Array.prototype.slice.call(arguments, 2);
  if (levels.indexOf(level) >= levels.indexOf(logger.debugLevel) ) {
    if (typeof message !== 'string') {
      message = JSON.stringify(message);
    }
    console.log.call(null, level + ': ' + message, args);
  }
};
