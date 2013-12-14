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

function requestGame(playerName) {
    socket.emit('requestGame', {playerName: playerName});
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

socket.on('requestGame', function(data) {
	$.pnotify({
		title: 'Game Request',
		text: data.playerName + ' requested a game'
	});
});

socket.on('addNewPlayer', function(data) {
	if(data.isSelf === false) {
		$("#playersList").append('<li id="' + data.playerName + '">' +
			data.playerName + '&nbsp;<a href="#" id="' +
			data.playerName + '">Request</a></li>');
		$("a[id=" + data.playerName + "]").click(function(){
		requestGame(data.playerName);
		return false;});
	} else {
		$("#playersList").append('<li id="' + data.playerName + '">' +
			data.playerName + ' (You)</li>');
		$("#playerName").val(data.playerName);
	}
});

socket.on('removePlayerName', function(data) {
	$('#' + data).remove();
});

socket.on('fChangedPlayerName', function() {
	$('#playerNameErr').text("Such user already exists");	
});

$(function() {
  $.pnotify.defaults.styling = "jqueryui";
  $("#startGame").click(function() {startGame($("#gameStartPass").val());});
  $("#setPlayerName").click(function() {setPlayerName($("#playerName").val());});
});
