/*global location, WebSocket, io, $*/
"use strict";
var socket = io.connect(location.origin);

function startGame(pass) {
    socket.emit('startGame', pass);
}

$(function() {
  $("#startGame").click(function() {startGame($("#gameStartPass"));});
  socket.on('game started', function (data) {
  	$("#gamesList").append(data);
  });
});

