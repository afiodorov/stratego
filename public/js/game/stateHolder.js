'use strict';
var _ = require('../lib/underscore.js');
var GameStructs = require('./structs.js');
var GameLogic = require('./logic.js');

var stateHolder = function(stateJson) {
  this._observers = [];
  this.update(stateJson);
};

stateHolder.prototype.getSide = function() {
  return this._stateJson.mySide;
};

/* Gets number of pieces of a side in a tile */
stateHolder.prototype._piecesCount = function(side, tile) {
  return this._stateJson[side].pieces.filter(function(piece) {
    return _.isEqual(piece.position, tile);
  }).length;
};

/* Gets a number of pieces of my side in a tile */
stateHolder.prototype.piecesCount = this._piecesCount.bind(this, this.getSide());

/* Gets a number of pieces of the opponent in a tile */
stateHolder.prototype.oppPiecesCount = function(tile) {
  var oppSide = GameLogic.getOppSide(this.getSide());
  return _piecesCount(opponentSide, tile);
}

stateHolder.prototype.getOppTiles = function() {
  var oppSide = GameLogic.getOppSide(this.getSide());
  return _.map(this._stateJson[oppSide].pieces, function(piecePair) {
    return piecePair.position;
  });
}

stateHolder.prototype.update = function(stateJson) {
  this._stateJson = stateJson;
  this._observers.forEach(function(observer) {
    if (typeof observer.update === 'function') {
      observer.update.call(null, this._stateJson);
    }
  });
};

/* Checks if board tile out of space, takes into account only tiles of my side */
stateHolder.prototype.isTileFull = function(tile) {
  return this.piecesCount(tile) >= GameStructs.tiles[tile].capacity;
};

stateHolder.prototype.isOppTileFull = function(tile) {
  return this.oppPiecesCount(tile) >= GameStructs.tiles[tile].capacity;
};

/* Checks if tile [int, int] has an enemy piece */
stateHolder.prototype.isTileWithEnemy = function(tile) {
  var oppSide = GameLogic.getOppSide(this.getSide());
  return this._stateJson[oppSide].pieces.filter(
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
  if (this._observers.indexOf(observer) === -1) {
    this._observers.push(observer);
  }
};

stateHolder.prototype.getPieceLocation = function(piece) {
  var mySide = this.getSide();
  var piecePair = _.findWhere(this._stateJson[mySide].pieces, {name: piece});
  if(!piecePair) {
    return null;
  }

  return piecePair.position;
}

module.exports = stateHolder;
