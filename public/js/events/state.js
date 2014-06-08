'use strict';
var Event = require('./event.js');
var interactions = require('../game/structs/interactions.js');
var _ = require('lodash');
_.negate = require('../lib/negate.js');
_.isDefined = _.negate(_.isUndefined);

var StartingPostionsState = function(json) {
  var o = new Event();

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
    if (_.every([piece.position,
        piece.position.row, piece.position.col], _.isDefined)) {
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

  o.requiredInteraction = interactions.chooseStartingPositions;

  // some addinoal checks
  o.isValid = true;
  return o;
};

var makeState = function(json) {
  if (json.requiredInteraction === interactions.chooseStartingPositions) {
    return new StartingPostionsState(json);
  }

  // failed to construct a state
  var o = new Event();
  o.isValid = false;
  return o;
};

module.exports = makeState;
