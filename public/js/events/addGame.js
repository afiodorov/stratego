'use strict';
/*jslint node: true*/

var Event = require('../events/event.js');

var addGame = function(json) {
  var o = new Event();
  o._id = json._id;
  o.side = json.side;
  o.stage = json.stage;
  o.opponentName = json.opponentName;
  o.model = json.model;

  return o;
};

/**
 */
module.exports = addGame;
