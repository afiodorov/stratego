'use strict';
/*jslint node: true*/

var Base = require('./base.js');

var initialPlacement = {
  'Mordor': 4,
  'Gondor': 1,
  'Dagorlad' : 1,
  'Mirkwood' : 1,
  'Fangorn' : 1,
  'Rohan' : 1
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
