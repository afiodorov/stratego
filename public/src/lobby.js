/*global location, Weblobby, io, $, ko*/
"use strict";
var lobby = io.connect(location.origin + '/lobby');

function startGame(pass) {
  lobby.emit('startGame', {pass: pass});
}

function getListOfGames(){
  lobby.emit('getListOfGames');
}

function setPlayerName(name) {
  lobby.emit('setPlayerName', {playerName : name});
}

function requestGame(playerName) {
  lobby.emit('requestGame', {playerName: playerName});
}

function acceptGame(playerName) {
  lobby.emit('acceptGame', {playerName: playerName});
}

lobby.on('gameStarted', function(data) {
  $.pnotify({
    title: 'New Game started',
    text: encodeURI(data.playerName) + ' started a game with you!'
  });
});

lobby.on('listOfPlayers', function(data) {
  $("#playersList").empty();
  data.forEach(function(entry) {
    $("#playersList").append('<li>' + entry + '</li>');
  });
});

lobby.on('requestGame', function(data) {
  $.pnotify({
    title: 'Game Request',
    text: encodeURI(data.playerName) + ' requested a game. ' +
    '<a href="#" id="acc' + encodeURI(data.playerName) + '">Accept</a>.'
  });
  $("a[id=acc" + encodeURI(data.playerName) + "]").click(function(){
  acceptGame(data.playerName);
  return false;});

});

lobby.on('addNewPlayer', function(data) {
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

lobby.on('removePlayerName', function(data) {
  if(data.isSelf === false) {
    $('#p' + encodeURI(data.playerName)).remove();
  } else {
    $('#___self').remove();
  }
});

lobby.on('failChangingName', function() {
  $('#playerNameErr').text("Such user already exists"); 
});

$(function() {
  $.pnotify.defaults.styling = "jqueryui";
  $("#startGame").click(function() {startGame($("#gameStartPass").val());});
  $("#setPlayerName").click(function() {setPlayerName($("#playerName").val());});

  function AppViewModel() {
      var self = this;
      self.shouldShowPage = ko.observable(true);
      self.games = ko.observableArray();
      self.chatInput = ko.observable();
      self.currentGame = null;
      self.messages = ko.observableArray([]);

      self.switchToGame = function(game) {
        self.currentGame = game;
        self.messages([]);
        lobby.emit('requestGameStatus', game);
        lobby.emit('requestChatLog', game);
      };
      self.setShouldShowPage = function(show) {self.shouldShowPage(show);};
      self.onAddShortGame = function(game) {self.games.push(game);};
      self.onAddChatMessage = function(chat) {
      console.log(self.messages().length);
        if(self.messages().length > 20) {
          self.messages.shift();
        }
        self.messages.push(chat);
      };
      self.sendChatInput = function() {
        if(self.currentGame) {
          lobby.emit('addChatMessage', {gameid: self.currentGame.id, message: self.chatInput()});
        } else {
          // TODO display error
          console.log('no chat selected');
        }
      };
      self.setChatLog = function(log) {
        self.messages(log);
      };
  }

  var appViewModel = new AppViewModel();
  ko.applyBindings(appViewModel);

  lobby.on('addChatMessage', function(chat) {
    appViewModel.onAddChatMessage(chat);
  });


  lobby.on('addShortGame', function(game) {
    appViewModel.onAddShortGame(game);
  });
  
  lobby.on('setChatLog', function(log){ 
    appViewModel.setChatLog(log);
  });

  lobby.on('setShouldShowPage', function(data) {
    appViewModel.setShouldShowPage(data.bool);
    $("#blockingMsg").text(data.err);
    $("#blockingMsg").dialog({
       closeOnEscape: false,
       open: function(event, ui) 
              {$(".ui-dialog-titlebar-close", $(this).parent()).hide();}
    });
  });
});
