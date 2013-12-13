/*global location, WebSocket, io, $*/
"use strict";
var socket = io.connect(location.origin);

function startGame() {
    socket.emit('startGame', { my: 'data' });
}

$(function() {
  $("#startGame").click(function() {startGame();});
  socket.on('game started', function () {
  	$("#gamesList").append("Test");
  });
});

