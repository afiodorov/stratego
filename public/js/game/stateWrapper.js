"use strict";
var _ = require("../lib/underscore.js");
var GameStructs = require("./structs.js");
var GameLogic = require("./logic.js");

/*
var GameState = function() {
  var self = this;
  self.mySide = "light";
  self.stage = "game"; // start, game, battle
  self.turn = "light";
  self.light =  {
    piecesLeft: [{name: "gandalf", position: [2,2]}],
    cardsLeft: ["3", "retreat"]
  };
  self.dark = {
    piecesLeft: [{position: [3,1]}],
    cardsLeft: ["1", "magic"]
  };
  // each Observer must implement update() function
  self.observers = [];
};
 */

var GameState = function(gameStateJson) {
  this.update(gameStateJson);
};

GameState.prototype.getSide = function() {
  return this._json.mySide;
};

GameState.prototype.piecesCount = function(tile) {
  return this._json[this.getSide()].piecesLeft.filter(function(piece) {
    return _.isEqual(piece.position, tile);
  }).length;
};

GameState.prototype.update = function(gameStateJson) {
  this._json = gameStateJson;
};

/* Checks if board tile out of space */
GameState.prototype.isTileFull = function(tile) {
  return this.piecesCount(tile) >= GameStructs.tiles[tile].capacity;
};

/* Checks if tile [int, int] has an enemy piece */
GameState.prototype.isTileWithEnemy = function(tile) {
  var oppositeSide = GameLogic.getOppositeSide(this.getSide());
  return this._json[oppositeSide].piecesLeft.filter(
      function(piece) {
        return _.isEqual(piece.position, tile);
      }).length !== 0;
};

/* Checks if client player has a card */
GameState.prototype.hasCard = function(card) {
  var side = this.getSide();
  return this._json[side].cardsLeft.indexOf(card) !== -1;
};

module.exports = {
  GameState : GameState
};
