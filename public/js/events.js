'use strict';
/*jslint node: true*/
var Event = require('./events/event.js');
var _ = require('lodash');
var side = require('./game/structs/side.js');
/**
 */
_.negate = require('./lib/negate.js');

var acceptedInviteSides = _.values(side).concat(['random']);
var gameStructs = require('./game/structs.js');
var makeState = require('./events/state.js');

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

/**
 */
module.exports = {
  InviteFromPlayer: InviteFromPlayer,
  InviteToPlayer: InviteToPlayer,
  Player: Player,
  ShouldShowPage: ShouldShowPage,
  RemovePlayer: RemovePlayer,
  ChatMessageToServer: ChatMessageToServer,
  ChatMessageFromServer: ChatMessageFromServer
};
