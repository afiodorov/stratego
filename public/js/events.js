'use strict';
var _ = require('./lib/lodash.js');
_.negate = require('./lib/negate.js');
var acceptedInviteSides = ['light', 'dark', 'random'];
var logic = require('./game/logic.js');
var gameStructs = require('./game/structs.js');

function notNull(prop) {
  return typeof(this[prop]) !== 'undefined';
}

var allPropertiesAreNotNull = function() {
  return _.every(_.keys(this), notNull, this);
};

var Event = function() {};

Event.prototype = {
  get isValid() {
    return allPropertiesAreNotNull.call(this);
  },
  set isValid() {},
  get json() {
    var getProperty = function(prop) {return this[prop];};
    var self = this;
    return _.reduceRight(
      _.keys(this).filter(_.compose(_.negate(_.isFunction), getProperty.bind(this))),
      function(thisWithoutFunctions, prop) {
        thisWithoutFunctions[prop] = self[prop];
        return thisWithoutFunctions;
      }, {});
    return thisWithoutFunctions;
  },
  set json() {}
};

var CardEvent = function(json) {
  o = new Event();
  o.card = json.card;

  // if(!gameSturcts.cards) {
  // o.isValid = false;
  // }
};

var Move = function(json) {
  o = new Event();
  o.piece = json.piece;
  o.toTile = json.toTile;

  if(!gameStructs.pieces[o.side][o.piece]) {
    o.isValid = false;
  }

  if(!gameStructs.isWithinGrid(o.toTile)) {
    o.isValid = false;
  }

  return o;
};

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

module.exports = {
  InviteFromPlayer : InviteFromPlayer,
  InviteToPlayer : InviteToPlayer,
  Player : Player,
  ShouldShowPage : ShouldShowPage,
  RemovePlayer : RemovePlayer,
  Move : Move
};
