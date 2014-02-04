/*global Enumerable*/
var gameStructs = require("./gameStructs");

var hasRequiredFields = function (o, requiredFields) {
  return requiredFields.reduce(function(res, prop) {
    return res && o.hasOwnProperty(prop);
  }, true);
};

var isGameStateValid = function(gameState) {
  var requiredFields = ["piecesLeft", "cardsLeft"];
  return hasRequiredFields(gameState, ["stage", "mySide", "turn"])
    && hasRequiredFields(gameState.light, requiredFields) 
    && hasRequiredFields(gameState.dark, requiredFields);
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
  if(!hasRequiredFields(move, ["piece", "side", "rowTo", "columnTo"])) {
    return false;
  }

  if(!isSideValid(move.side)) {
    return false;
  }

  if(!gameStructs.pieces[move.side][move.piece]) {
    return false;
  }

  if(!gameStructs.isWithinGrid(move.rowTo, move.columnTo)) {
    return false;
  }
};

var isAttack = function(gameState, side, piece, rowTo, columnTo) {
  return true;
};

var getPieceLocation = function(gameState, side, piece) {
  var pieceLocArr =
    Enumerable.From(gameState[side].piecesLeft).Where(
    function(x) {return x.name === piece;}).Select(
    function(x) {return x.position;}).Take(1).toArray();
    if(pieceLocArr.length === 0) {
      return -1;
    }
  return pieceLocArr[0];
};

var isMoveValid = function(gameState, move) {
  /* 
   * move {piece, side, rowTo, columnTo}
  */

  var newState = null;

  if(!isGameStateValid(gameState)) {
    return {err: "Invalid gaming state passed"};
  }

  if(!isMoveObjectValid(move)) {
    return {err: "Invalid move passed"};
  }

  if(gameState.stage === "start" || "game") {
    if(move.side !== gameState.turn) {
      return {err: "Not your turn"};
    }
  }

  var pieceLocation = getPieceLocation(gameState, move.side, move.piece);
  if(pieceLocation === -1) {
    return {err: "You don't have that piece"};
  }

  return {
    newState : newState
  };
};

module.exports = {
  isMoveValid : isMoveValid,
};
