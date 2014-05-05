'use strict';
var events = require('./../events.js');
console.log(events);
var EventBase = events.EventBase;
var interactions = require('../game/structs/interactions.js');
var _ = require('../lib/lodash.js');

var StartingPostionsState = function(json) {
  var o = new EventBase();

  o.isValid = _.every([json.friendlyPieces, json.enemyPieces], _.isArray);
  if (!o.isValid) {
    return o;
  }

  o.friendlyPieces = [];
  json.friendlyPieces.forEach(function(piece) {
    if (piece.name) {
      o.friendlyPieces.push({name: piece.name});
    }
  });

  o.enemyPieces = [];
  json.enemyPieces.forEach(function(piece) {
    if (piece.position && piece.position.row && piece.position.col) {
      o.enemyPieces.push(
        {
          position: {
            row: piece.position.row,
            col: piece.position.col
          }
        }
      );
    }
  });

  // some addinoal checks
  o.isValid = true;
  return o;
};

var makeState = function(json) {
  if (json.requiredInteraction === interactions.chooseStartingPositions) {
    return new StartingPostionsState(json);
  }

  // failed to construct a state
  var o = new EventBase();
  o.isValid = false;
  return o;
};

module.exports = makeState;
