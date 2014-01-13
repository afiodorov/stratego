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

  function AppViewModel() {
      var self = this;
      self.shouldShowPage = ko.observable(true);
      self.games = ko.observableArray();
      self.players = ko.observableArray();
      self.chatInput = ko.observable();
      self.messages = ko.observableArray([]);
      self.myPlayerName = ko.observable("");
      var currentGame = null;

      self.switchToGame = function(game) {
        if(game !== currentGame) {
          currentGame = game;
          self.messages([]);
          lobby.emit('requestGameStatus', game);
          lobby.emit('requestChatLog', game);
        }
      };

      self.setShouldShowPage = function(show) {self.shouldShowPage(show);};
      self.onAddShortGame = function(game) {self.games.push(game);};
      self.onAddChatMessage = function(chat) {
        if(self.messages().length > 20) {
          self.messages.shift();
        }
        self.messages.push(chat);
      };
      self.sendChatInput = function() {
        if(currentGame) {
          lobby.emit('addChatMessage', {gameid: currentGame.id, message: self.chatInput()});
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
      self.isPlayerOnline = function(playerName) {
        return self.players.indexOf({player: playerName, isSelf: false}) !== -1;
      };
  }

  ko.bindingHandlers.playerOnline = {
      update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var players = ko.utils.unwrapObservable(valueAccessor());
        var found = false;
        players.forEach(function(player) {
          if(player.playerName === bindingContext.$data.opponentName) {
            found = true;
          }
        });
        if(!found) {
          element.style.visibility="hidden";
        } else {
          element.style.visibility="visible";
        }
      }
  };

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

