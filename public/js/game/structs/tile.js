﻿/// <reference path="side.js" />
var side = require('./side.js');

var tile = function (name, capacity, position) {  

  var pieces = [];

  var getDefendingSide = function () {
    if (pieces.length === 0) {
      return undefined;
    }
    return pieces[0].side;
  }

  var addPiece = function (piece) {
    if (pieces.indexOf(piece) !== -1) {
      throw "Piece already here!";
    }
    if (pieces.length > 0 && piece.side !== pieces[0].side) {
      //BATTTTLTLTLTLELLELELELELEELELELLLELELELELELLELLLLEEE
      //I dont think it should be dealt with here.
    }
    if (atMaxCap()) {
      throw "No more space";
    }
    pieces.push(piece);
  }

  var removePiece = function (piece) {
    if (pieces.indexOf(piece) === -1) {
      throw "Piece not found!";
    }
    return pieces.pop(piece);
  }

  var atMaxCap = function () {
    return pieces.length === capacity;
  }

  return {
    name: name,
    capacity: capacity,

    getPieces: function () {
      return pieces;
    },

    addPiece: addPiece,

    removePiece: removePiece,

    position: position,

    isAtMaxCap: atMaxCap

  };
};

module.exports = tile;