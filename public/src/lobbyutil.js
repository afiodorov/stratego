/*global location, WebSocket, $*/
"use strict";
var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);

function startGame(password) {
	ws.send(JSON.stringify({event:'startGame', event_data: password}));
}

$(function() {
   $("#startGame").click(function() {startGame();});
});
