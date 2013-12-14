/*global location, WebSocket, io, $*/
"use strict";
var socket = io.connect(location.origin);

function startGame(pass) {
    socket.emit('startGame', {pass: pass});
}

function getListOfGames(){
    socket.emit('getListOfGames');
}

socket.on('listOfGames', function(data) {
	$("#gamesList").empty();
	data.forEach(function(entry) {
		$("#gamesList").append('<li>' + entry + '</li>');
	});
});

$(function() {
  $("#startGame").click(function() {startGame($("#gameStartPass").val());});
  
  getListOfGames();
});
