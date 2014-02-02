/*global $*/
"use strict";
var Game = function(gameId) {
  var context = $("#" + gameId + "canvas.game-canvas")[0].getContext('2d');

  return this;
};
