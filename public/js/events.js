'use strict';
var _ = require('./lib/underscore.js');
var acceptedInviteSides = ['light', 'dark', 'random'];

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
};
