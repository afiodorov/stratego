'use strict';
var _ = require('./lib/underscore.js');
var acceptedInviteSides = ['light', 'dark', 'random'];
var gameLogic = require('./game/logic.js');
var gameStructs = require('./game/structs.js');

function notNull(prop) {
  return typeof(this[prop]) !== 'undefined';
}

var allPropertiesAreNotNull = function() {
  return _.every(Object.getOwnPropertyNames(this), notNull, this);
};

function Event() {}
Event.prototype = {
  get isValid() {
    return allPropertiesAreNotNull.call(this);
  }
};

var Move = function(json) {
  o = new Event();
  o.piece = json.piece;
  o.side = json.side;
  o.toTile = json.toTile;

  if(!gameLogic.isSideValid(o.side)) {
    o.isValid = false;
  }

  if(!gameStructs.pieces[o.side][o.piece]) {
    o.isValid = false;
  }

  if(!gameStructs.isWithinGrid(o.toTile)) {
    o.isValid = false;
  }

  return o;
}

var InviteFromPlayer = function(json) {
  var o = new Event();
  o.opponentName = json.opponentName;
  o.mySide = json.mySide;

  if(acceptedInviteSides.indexOf(json.mySide) === -1) {
    o.isValid = false;
  }
  return o;
};

var InviteToPlayer = function(json) {
  var o = new Event();
  o.opponentName = json.opponentName;
  o.opponentSide = json.opponentSide;

  if(acceptedInviteSides.indexOf(json.opponentSide) === -1) {
    o.isValid = false;
  }
  return o;
};

var Player = function(json) {
  var o = new Event();
  o.playerName = json.playerName;
  o.invitesAccepted = json.invitesAccepted;
  o.isSelf = json.isSelf;

  return o;
};

var ShouldShowPage = function(json) {
  var o = new Event();
  o.bool = json.bool;
  o.err = json.err;
  return o;
};

module.exports = {
  InviteFromPlayer : InviteFromPlayer,
  InviteToPlayer : InviteToPlayer,
  Player : Player,
  ShouldShowPage : ShouldShowPage,
  Move : Move
};
