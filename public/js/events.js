'use strict';
var _ = require('./lib/lodash.js');
_.negate = require('./lib/negate.js');
var acceptedInviteSides = ['light', 'dark', 'random'];
var logic = require('./game/logic.js');
var gameStructs = require('./game/structs.js');
var makeState = require('./events/state.js');

var EventBase = function() {return undefined;};
EventBase.prototype = {
  get isValid() {
    if (typeof this._isValid !== 'undefined') {
      return this._isValid;
    }

    return _.every(_.keys(this), _.negate(_.isNull));
  },
  set isValid(value) {
    this._isValid = value;
  },
  get json() {
    var getProperty = function(prop) {return this[prop];};
    var self = this;
    return _.reduceRight(
      _.keys(this).filter(
       _.compose(_.negate(_.isFunction), getProperty.bind(this))),
      function(thisWithoutFunctions, prop) {
        thisWithoutFunctions[prop] = self[prop];
        return thisWithoutFunctions;
      }, {});
  },
  set json(value) {
    return value;
  }
};

var CardEvent = function(json) {
  var o;
  o = new EventBase();
  o.card = json.card;

  // if(!gameSturcts.cards) {
  // o.isValid = false;
  // }
};

var Move = function(json) {
  var o;
  o = new EventBase();
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
  var o = new EventBase();
  o.opponentName = json.opponentName;
  o.mySide = json.mySide;

  if (acceptedInviteSides.indexOf(json.mySide) === -1) {
    o.isValid = false;
  }
  return o;
};

var InviteToPlayer = function(json) {
  var o = new EventBase();
  o.opponentName = json.opponentName;
  o.opponentSide = json.opponentSide;

  if (acceptedInviteSides.indexOf(json.opponentSide) === -1) {
    o.isValid = false;
  }
  return o;
};

var ChatMessageFromServer = function(json) {
  var o = new EventBase();
  o.gameId = json.gameId;
  o.message = json.message;
  o.date = json.date;
  o.playerName = json.playerName;

  return o;
};

var ChatMessageToServer = function(json) {
  var o = new EventBase();
  o.gameId = json.gameId;
  o.message = json.message;

  return o;
};

var RemovePlayer = function(json) {
  var o = new EventBase();
  o.playerName = json.playerName;
  return o;
};

var Player = function(json) {
  var o = new EventBase();
  o.playerName = json.playerName;
  o.invitesAccepted = json.invitesAccepted;
  o.isSelf = json.isSelf;

  return o;
};

var ShouldShowPage = function(json) {
  var o = new EventBase();
  o.bool = json.bool;
  o.err = json.err;
  return o;
};

var Game = function(json) {
  var o = new EventBase();
  o._id = json._id;
  o.opponentName = json.opponentName;

  o.state = makeState(json.state);
  if (!o.state.isValid) {
    o.isValid = false;
  }
  return o;
};

module.exports = {
  EventBase: EventBase,
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
