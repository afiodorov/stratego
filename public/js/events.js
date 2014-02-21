'use strict';
var _ = require('./lib/underscore.js');

function notNull(prop) {
  return typeof(this[prop]) !== 'undefined';
}

var allPropertiesAreNotNull = function() {
  return _.every(Object.getOwnPropertyNames(this), notNull, this);
}

function Event() {}
Event.prototype.isValid = allPropertiesAreNotNull.bind(this);

var cInvite = function(json) {
  var o = new Event();
  o.opponentName = json.opponentName;
  o.mySide = json.mySide;
  return o;
};

var sInvite = function(json) {
  var o = new Event();
  o.opponentName = json.opponentName;
  o.opponentSide = json.opponentSide;
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
}

module.exports = {
  cInvite : cInvite,
  sInvite : sInvite,
  Player : Player,
  ShouldShowPage : ShouldShowPage,
}
