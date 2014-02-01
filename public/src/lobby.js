/*global location, Weblobby, io, $, ko*/
"use strict";
var lobby = io.connect(location.origin + '/lobby');

$(function() {
  $.pnotify.defaults.styling = "jqueryui";

  ko.bindingHandlers.playerOnline = {
      update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var players = ko.utils.unwrapObservable(valueAccessor());
        var found = false;
        players.forEach(function(player) {
          if(player.playerName === bindingContext.$data.opponentName) {
            found = true;
          }
        });
        element.style.visibility = found ? "visible" : "hidden";
      }
  };

  var appViewModel = new AppViewModel(lobby);
  appViewModel.bindSocketEmitters();
  ko.applyBindings(appViewModel);
  appViewModel.bindSocketHandlers();

});

function AppViewModel(lobby_) {
    var self = this;
    var lobby = lobby_;
    var _gameToBeClosed = null;

    Object.defineProperty(self, "gameToBeClosed", 
      {get : function(){ return _gameToBeClosed; }});

    var _currentGame = null;
    Object.defineProperty(self, "currentGame", 
      {get : function(){ return _currentGame; }});

    self.shouldShowPage = ko.observable(true);
    self.games = ko.observableArray();
    self.players = ko.observableArray();
    self.chatInput = ko.observable();
    self.myPlayerName = ko.observable("");
    self.isCloseGameDialogOpen = ko.observable(false);
    self.opponentNameOfGameToBeClosed = ko.observable("");

    self.switchToGame = function(game) {
      _currentGame = game;
    };

    self.setShouldShowPage = function(show) {self.shouldShowPage(show);};

    self.sendChatInput = function() {
      if(_currentGame) {
        lobby.emit('addChatMessage', {gameid: _currentGame.id, message: self.chatInput()});
        self.chatInput("");
      } else {
        // TODO display error
        console.log('no chat selected');
      }
    };

    self.isPlayerOnline = function(playerName) {
      return self.players.indexOf({player: playerName, isSelf: false}) !== -1;
    };

    self.openCloseGameDialog = function() {
      self.isCloseGameDialogOpen(true);
      _gameToBeClosed = this;
      self.opponentNameOfGameToBeClosed(this.opponentName);
    };

    self.requestGame = function(player) {
      lobby.emit('requestGame', {playerName: player.playerName});
    };

    self.emitResignGame = null;
    self.emitChangeMyPlayerName = null;
    
    var findGame = function(gameid) {
      var correspondingGame;
      var allGames = self.games();
      var i;
      for(i=0; i<allGames.length; i++) {
        if(allGames[i].id === gameid) {
          correspondingGame = allGames[i];
          break;
        }
      }
      return correspondingGame;
    };

    self.onSetChatLog = function(log) {
      var correspondingGame = findGame(log.gameid);
      if(typeof correspondingGame !== "undefined") {
        correspondingGame.messages(log.log);
      } else {
        console.log("received chat message for a non-existing game");
      }
      return self.onSetChatLog;
    };

    self.onAddShortGame = function(game) {
        game.messages = ko.observableArray([]);
        self.games.push(game);

        lobby.emit('requestGameStatus', game);
        lobby.emit('requestChatLog', game);
    };

    self.onAddChatMessage = function(chat) {
      var game = findGame(chat.gameid);
      if(typeof game === "undefined") {
        console.log("received a chat message to an non-existing game");
        return self.onAddChatMessage;
      }

      if(game.messages().length > 20) {
        game.messages.shift();
      }
      game.messages.push(chat);

      return self.onAddChatMessage;
    };

    self.onAddPlayerName = function(player) {
      self.players.push(player);
      return self.onAddPlayerName;
    };

    self.onRemovePlayerName = function(player) {
      self.players.remove(
        function(playerIt) {
          return playerIt.playerName === player.playerName;
        }
      );
      return self.onRemovePlayerName;
    };

    self.onSetMyPlayerName = function(player) {
      self.myPlayerName(player.playerName);
      return self.onSetMyPlayerName;
    };

    self.onRemoveGame = function(game) {
      self.games.remove(
        function(gameIt) {
          return gameIt.id === game.id;
        }
      );  
      return self.onRemoveGame;
    };
      
    self.onRequestGame = function(data) {
      $.pnotify({
        title: 'Game Request',
        text: data.playerName + ' requested a game. ' +
        '<a href="#" id="acc' + encodeURI(data.playerName) + '">Accept</a>.'
      });
      $("a[id=acc" + encodeURI(data.playerName) + "]").click(function(){
        lobby.emit('acceptGame', {playerName: data.playerName});
      return false;});
      return self.onRemoveGame;
    };

    self.onGameStarted = function(game) {
        $.pnotify({
          title: 'New Game started',
          text: game.playerName + ' started a game with you!'
        });
      return self.onGameStarted;
    };

    self.onFailChangingName = function(data) {
      $.pnotify({
        title: 'Couldn\'t change user name',
        text: data,
        type: 'error',
        icon: false
      });
      return self.onFailChangingName;
    };

    self.onOpponentResigned = function(opponentName) {
      $.pnotify({
        title: 'Game finished',
        text: opponentName + ' has quit the game.',
        type: 'success',
        icon: 'ui-icon ui-icon-flag'
        });
      return self.onOpponentResigned;
    };

    self.onAddNewPlayer = function(data) {
      if(data.isSelf === false) {
        self.onAddPlayerName(data);
      } else {
        self.onSetMyPlayerName(data);
      }
      return self.onAddNewPlayer;
    };

    self.onSetShouldShowPage = function(data) {
      self.setShouldShowPage(data.bool);
      $("#blockingMsg").text(data.err);
      $("#blockingMsg").dialog({
         closeOnEscape: false,
         open: function(event, ui) 
                {$(".ui-dialog-titlebar-close", $(this).parent()).hide();}
      });
      return self.onSetShouldShowPage;
    };
    
    self.bindSocketHandlers = function() {
      var prop;
      var eventName;
      for(prop in self) {
        if(self.hasOwnProperty(prop)) {
          if(prop.match(/^on/) && typeof self[prop] === 'function') {
            eventName = prop[2].toLowerCase() + prop.slice(3);
            lobby.on(eventName, self[prop]);
          }
        }
      }
    };

    self.bindSocketEmitters = function() {
      var prop;
      var eventName;
      var makeSocketEmitter = function(eventName, objectToEmit) {
        var _eventName = eventName;
        (function(){lobby.emit(_eventName, objectToEmit);}());
      };

      for(prop in self) {
        if(self.hasOwnProperty(prop)) {
          if(prop.match(/^emit/)) {
            eventName = prop[4].toLowerCase() + prop.slice(5);
            self[prop] = makeSocketEmitter.bind(self, eventName);
          }
        }
      }
    };
}
