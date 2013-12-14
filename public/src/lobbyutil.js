/*global location, WebSocket, io, $*/
"use strict";
var socket = io.connect(location.origin);

function startGame(pass) {
    socket.emit('startGame', {pass: pass});
}

function getListOfGames(){
    socket.emit('getListOfGames');
}

function setPlayerName(name) {
    socket.emit('setPlayerName', {playerName : name});
}

socket.on('listOfGames', function(data) {
	$("#gamesList").empty();
	data.forEach(function(entry) {
		$("#gamesList").append('<li>' + entry + '</li>');
	});
});

socket.on('listOfPlayers', function(data) {
	$("#playersList").empty();
	data.forEach(function(entry) {
		$("#playersList").append('<li>' + entry + '</li>');
	});
});

socket.on('addNewPlayer', function(data) {
	$("#playersList").append('<li id="' + data + '">' + data + '</li>');
});

socket.on('removePlayerName', function(data) {
	$('#' + data).remove();
});

$(function() {
  $("#startGame").click(function() {startGame($("#gameStartPass").val());});
  $("#setPlayerName").click(function() {setPlayerName($("#playerName").val());});
});
