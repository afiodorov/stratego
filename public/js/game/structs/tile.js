﻿
var tile = function (name, capacity, position) {  

  var pieces = [];

  var addPiece = function (piece) {
    if (pieces.indexOf(piece) !== -1) {
      throw "Piece already here!";
    }
    pieces.push(piece);
  }

  var removePiece = function (piece) {
    if (pieces.indexOf(piece) === -1) {
      throw "Piece not found!";
    }
    pieces.pop(piece);
  }

  return {
    name: name,
    capacity: capacity,

    getPieces: function () {
      return pieces;
    },

    addPiece: addPiece,

    removePiece: removePiece,

    position: position

  };
};

module.exports = tile;