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

var isMoveObjectValid = function(move) {
  if(!hasRequiredFields(move, ["piece", "side", "tileNumber"])) {
    return false;
  }

  if(!isSideValid(move.side)) {
    return false;
  }

  if(!gameStructs.pieces[move.side][move.piece]) {
    return false;
  }

  if(isNaN(move.tileNumber) 
  || move.tileNumber >= gameStructs.tiles.length 
  || move.tileNumber < 0) {
    return false;
  }
};

var pieceLocation = function(gameState, side, piece) {
  var pieceLocArr = Enumerable.From(gameState[side].piecesLeft).Where(function(x) {return x.name === piece;}).Select(function(x) {return x.position;}).Take(1).toArray();
  if(pieceLocArr.length === 0) {
    return -1;
  }
  return pieceLocArr[0];
};

var isMoveValid = function(gameState, move) {
  /* 
   * move {piece, side, tileNumber}
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

  return {
    newState : newState
  };
};

module.exports = {
  isMoveValid : isMoveValid,
};
