'use strict';
var Event = require('./events/event.js');
var _ = require('lodash');
_.negate = require('./lib/negate.js');

var acceptedInviteSides = ['light', 'dark', 'random'];
var logic = require('./game/logic.js');
var gameStructs = require('./game/structs.js');
var makeState = require('./events/state.js');

var CardEvent = function(json) {
  var o;
  o = new Event();
  o.card = json.card;

  // if(!gameSturcts.cards) {
  // o.isValid = false;
  // }
};

var Move = function(json) {
  var o;
  o = new Event();
  o.piece = json.piece;
  o.toTile = json.toTile;

  if (!gameStructs.pieces[o.side][o.piece]) {
    o.isValid = false;
  }

  if (!gameStructs.isWithinGrid(o.toTile)) {
    o.isValid = false;
  }

  return o;
};

var InviteFromPlayer = function(json) {
  var o = new Event();
  o.opponentName = json.opponentName;
  o.mySide = json.mySide;

  if (acceptedInviteSides.indexOf(json.mySide) === -1) {
    o.isValid = false;
  }
  return o;
};

var InviteToPlayer = function(json) {
  var o = new Event();
  o.opponentName = json.opponentName;
  o.opponentSide = json.opponentSide;

  if (acceptedInviteSides.indexOf(json.opponentSide) === -1) {
    o.isValid = false;
  }
  return o;
};

var ChatMessageFromServer = function(json) {
  var o = new Event();
  o.gameId = json.gameId;
  o.message = json.message;
  o.date = json.date;
  o.playerName = json.playerName;

  return o;
};

var ChatMessageToServer = function(json) {
  var o = new Event();
  o.gameId = json.gameId;
  o.message = json.message;

  return o;
};

var RemovePlayer = function(json) {
  var o = new Event();
  o.playerName = json.playerName;
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

var Game = function(json) {
  var o = new Event();
  o._id = json._id;
  o.opponentName = json.opponentName;

  o.state = makeState(json.state);
  if (!o.state.isValid) {
    o.isValid = false;
  }
  return o;
};

module.exports = {
  InviteFromPlayer: InviteFromPlayer,
  InviteToPlayer: InviteToPlayer,
  Player: Player,
  ShouldShowPage: ShouldShowPage,
  RemovePlayer: RemovePlayer,
  ChatMessageToServer: ChatMessageToServer,
  ChatMessageFromServer: ChatMessageFromServer,
  Game: Game,
  Move: Move
};
