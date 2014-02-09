"use strict";
var _ = require("../lib/underscore.js");
var GameStructs = require("./structs.js");
var GameLogic = require("./logic.js");

var stateHolder = function(stateJson) {
  this._observers = [];
  this.update(stateJson);
};

stateHolder.prototype.getSide = function() {
  return this._stateJson.mySide;
};

stateHolder.prototype.piecesCount = function(tile) {
  return this._stateJson[this.getSide()].pieces.filter(function(piece) {
    return _.isEqual(piece.position, tile);
  }).length;
};

stateHolder.prototype.update = function(stateJson) {
  this._stateJson = stateJson;
  this._observers.forEach(function(observer) {
    if(typeof observer.update === "function") {
      observer.update.call(null, this._stateJson);
    }
  });
};

/* Checks if board tile out of space */
stateHolder.prototype.isTileFull = function(tile) {
  return this.piecesCount(tile) >= GameStructs.tiles[tile].capacity;
};

/* Checks if tile [int, int] has an enemy piece */
stateHolder.prototype.isTileWithEnemy = function(tile) {
  var oppositeSide = GameLogic.getOppositeSide(this.getSide());
  return this._stateJson[oppositeSide].pieces.filter(
      function(piece) {
        return _.isEqual(piece.position, tile);
      }).length !== 0;
};

/* Checks if client player has a card */
stateHolder.prototype.hasCard = function(card) {
  var side = this.getSide();
  return this._stateJson[side].cardsLeft.indexOf(card) !== -1;
};

stateHolder.prototype.addObserver = function(observer) {
  if(this._observers.indexOf(observer) === -1) {
    this._observers.push(observer);
  }
};

module.exports = stateHolder;
