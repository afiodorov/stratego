/*global Enumerable*/
'use strict';
var gameStructs = require("./structs.js");

var hasRequiredFields = function(o, requiredFields) {
  return requiredFields.reduce(function(res, prop) {
    return res && o.hasOwnProperty(prop);
  }, true);
};

var isGameStateValid = function(stateHolder) {
  var requiredFields = ["pieces", "cards"];
  return hasRequiredFields(stateHolder, ["stage", "mySide", "turn"])
    && hasRequiredFields(stateHolder.light, requiredFields) 
    && hasRequiredFields(stateHolder.dark, requiredFields);
};

var isSideValid = function(side) {
  return ["light", "dark"].indexOf(side) !== -1;
};

var getOppositeSide = function(side) {
  if(side === "light") {
    return "dark";
  } 

  if(side === "dark") {
    return "light";
  }

  throw new TypeError("Can't get opposite side");
};

var isMoveObjectValid = function(move) {
  if(!hasRequiredFields(move, ["piece", "side", "toTile"])) {
    return false;
  }

  if(!isSideValid(move.side)) {
    return false;
  }

  if(!gameStructs.pieces[move.side][move.piece]) {
    return false;
  }

  if(!gameStructs.isWithinGrid(move.toTile)) {
    return false;
  }
};

var isAttack = function(stateHolder, move) {
  return stateHolder.isTileWithEnemy(move.toTile);
};

var getPieceLocation = function(stateHolder, side, piece) {
  var pieceLocArr =
    Enumerable.From(stateHolder[side].piecesLeft).Where(
    function(x) {return x.name === piece;}).Select(
    function(x) {return x.position;}).Take(1).toArray();
    if(pieceLocArr.length === 0) {
      return -1;
    }
  return pieceLocArr[0];
};

var isMoveValid = function(stateHolder, move) {
  /* 
   * move {piece, side, toTile}
  */

  var newState = null;

  if(!isGameStateValid(stateHolder)) {
    return {err: "Invalid gaming state passed"};
  }

  if(!isMoveObjectValid(move)) {
    return {err: "Invalid move passed"};
  }

  if(stateHolder.stage === "start" || "game") {
    if(move.side !== stateHolder.turn) {
      return {err: "Not your turn"};
    }
  }

  var pieceLocation = getPieceLocation(stateHolder, move.side, move.piece);
  if(pieceLocation === -1) {
    return {err: "You don't have that piece"};
  }

  return {
    newState : newState
  };
};

module.exports = {
  isMoveValid : isMoveValid,
  getOppositeSide : getOppositeSide
};

/* autocompletion now works */
if(false) {
  var StateHolder = require('./stateHolder.js');
  var stateHolder = new StateHolder();
  isAttack(stateHolder, {piece: 'gandalf', side: 'light', toTile: [1,1]});
  isMoveValid(stateHolder, {piece: 'gandalf', side: 'light', toTile: [1,1]});
}
