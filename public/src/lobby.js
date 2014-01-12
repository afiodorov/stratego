/*global location, Weblobby, io, $, ko*/
"use strict";
var lobby = io.connect(location.origin + '/lobby');

function startGame(pass) {
  lobby.emit('startGame', {pass: pass});
}

function getListOfGames(){
  lobby.emit('getListOfGames');
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

lobby.on('failChangingName', function(data) {
  $.pnotify({
    title: 'Couldn\'t change user name',
    text: data,
    type: 'error',
    icon: false
  });
});

$(function() {
  $.pnotify.defaults.styling = "jqueryui";
  $("#startGame").click(function() {startGame($("#gameStartPass").val());});

  function AppViewModel() {
      var self = this;
      self.shouldShowPage = ko.observable(true);
      self.games = ko.observableArray();
      self.players = ko.observableArray();
      self.chatInput = ko.observable();
      self.currentGame = null;
      self.messages = ko.observableArray([]);
      self.shouldShowMain = ko.observable(true);
      self.shouldShowCanvas = ko.observable(false);
      self.myPlayerName = ko.observable("");
      self.showMainTab = function(bool) {
        self.shouldShowMain(bool);
        self.shouldShowCanvas(!bool);
      };
      self.setShouldShowCanvas = function(bool) {
        self.shouldShowCanvas(bool);
      };

      self.switchToGame = function(game) {
        self.showMainTab(false);
        if(game !== self.currentGame) {
          self.currentGame = game;
          self.messages([]);
          lobby.emit('requestGameStatus', game);
          lobby.emit('requestChatLog', game);
        }
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
          self.chatInput("");
        } else {
          // TODO display error
          console.log('no chat selected');
        }
      };
      self.setChatLog = function(log) {
        self.messages(log);
      };
      self.onAddPlayerName = function(player) {self.players.push(player);};
      self.onRemovePlayerName = function(player) {
        self.players.remove(
          function(playerIt) {
            return playerIt.playerName === player.playerName;
          }
        );
      };
      self.requestGame = function(player) {
        lobby.emit('requestGame', {playerName: player.playerName});
      };
      self.onSetMyPlayerName = function(player) {
        self.myPlayerName(player.playerName);
      };
      self.onChangeMyPlayerName = function() {
        lobby.emit('setPlayerName', {playerName: self.myPlayerName()});
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

  lobby.on('addNewPlayer', function(data) {
    if(data.isSelf === false) {
      appViewModel.onAddPlayerName(data);
    } else {
      appViewModel.onSetMyPlayerName(data);
    }
  });
  lobby.on('removePlayerName', function(data) {
    appViewModel.onRemovePlayerName(data);
  });
});

