'use strict';
/*jslint node: true*/

var Base = require('./base.js');

var initialPlacement = {
  'The Shire': 4,
  'Arthedam': 1,
  'Cardolan' : 1,
  'Rhudaur' : 1,
  'Eregion' : 1,
  'Enedwaith' : 1
};

var Rules = function(progress) {
  this.progress = progress;
  this._initialPlacement = initialPlacement;
};

Rules.prototype = new Base();

/**
 */
Rules.prototype.constructor = Rules;

/**
 */
module.exports = Rules;
