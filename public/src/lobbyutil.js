/*global location, WebSocket, io, $, ko*/
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

function acceptGame(playerName) {
  socket.emit('acceptGame', {playerName: playerName});
}

socket.on('gameStarted', function(data) {
  $.pnotify({
    title: 'New Game started',
    text: encodeURI(data.playerName) + ' started a game with you!'
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
    text: encodeURI(data.playerName) + ' requested a game. ' +
    '<a href="#" id="acc' + encodeURI(data.playerName) + '">Accept</a>.'
  });
  $("a[id=acc" + encodeURI(data.playerName) + "]").click(function(){
  acceptGame(data.playerName);
  return false;});

});

socket.on('addNewPlayer', function(data) {
  if(data.isSelf === false) {
    $("#playersList").append('<li id="p' + encodeURI(data.playerName) + '">' +
      encodeURI(data.playerName) + '&nbsp;<a href="#" id="req' +
      encodeURI(data.playerName) + '">Request</a></li>');
    $("a[id=req" + encodeURI(data.playerName) + "]").click(function(){
    requestGame(data.playerName);
    return false;});
  } else {
    $("#playersList").append('<li id="___self">' +
      encodeURI(data.playerName) + ' (You)</li>');
    $("#playerName").val(encodeURI(data.playerName));
    $("#__playerName").val(encodeURI(data.playerName));
  }
});

socket.on('removePlayerName', function(data) {
  if(data.isSelf === false) {
    $('#p' + encodeURI(data.playerName)).remove();
  } else {
    $('#___self').remove();
  }
});

socket.on('failChangingName', function() {
  $('#playerNameErr').text("Such user already exists"); 
});

$(function() {
  $.pnotify.defaults.styling = "jqueryui";
  $("#startGame").click(function() {startGame($("#gameStartPass").val());});
  $("#setPlayerName").click(function() {setPlayerName($("#playerName").val());});

  function AppViewModel() {
      var self = this;
      self.games = ko.observableArray();
      self.shouldShowPage = ko.observable(true);
  }
  AppViewModel.prototype.getGames = function() {return this.games;};
  AppViewModel.prototype.setShouldShowPage = function(show) {this.shouldShowPage(show);};

  var appViewModel = new AppViewModel();
  ko.applyBindings(appViewModel);

  socket.on('addShortGame', function(game) {
    appViewModel.getGames().push(game);
  });
  socket.on('setShouldShowPage', function(data) {
    appViewModel.setShouldShowPage(data.bool);
    $("#blockingMsg").text(data.err);
    $("#blockingMsg").dialog({
       closeOnEscape: false,
       open: function(event, ui) {$(".ui-dialog-titlebar-close", $(this).parent()).hide();}
    });
  });

});
