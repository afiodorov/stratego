'use strict';
/*jslint node: true*/

var stage = require('./structs/stage.js');
var side = require('./structs/side.js');

/**
 */
var RulesFactory = {};

/**
 *  @param {Progress} progress
 *  @return {Function}
 */
RulesFactory.getConstructor = function(progress) {
  if (progress.json.stage === stage.piecesPlacement) {
    if (progress.json.side === side.LIGHT) {
      return require('./rules/piecesPlacement/light.js');
    }
  }
};

/**
 * @constructor
 * @param {Progress} progress
 */
var Rules = function(progress) {
  var RulesConstractor = RulesFactory.getConstructor(progress);
  var rules = new RulesConstractor(progress);
  return rules;
};

/**
 */
module.exports = Rules;
