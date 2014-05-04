/*global location, localStorage*/
'use strict';
var io = require('./lib/socket.io.js');
var _ = require('./lib/underscore.js');
var inviteTypes = require('./inviteTypes.js');
var $ = require('jquery');
$.pnotify = require('pnotify');
var ko = require('knockout');
var lobbySocket = io.connect(location.origin + '/lobby');
require('knockout-jquery');
var events = require('./events.js');

function AppViewModel(lobbySocket_) {
    var self = this;
    var lobbySocket = lobbySocket_;
    var _playerInvited = null;
    Object.defineProperty(self, 'playerInvited', 
      {get : function(){ return _playerInvited; }});

    var _gameToBeClosed = null;
    Object.defineProperty(self, 'gameToBeClosed', 
      {get : function(){ return _gameToBeClosed; }});

    var _currentGame = null;
    Object.defineProperty(self, 'currentGame', 
      {get : function(){ return _currentGame; }});

    self.activeTab = ko.observable();
    self.shouldShowPage = ko.observable(true);
    self.invitesAccepted = ko.observable('all');
    self.games = ko.observableArray();
    self.players = ko.observableArray();
    self.chatInput = ko.observable();
    self.myPlayerName = ko.observable('');
    self.isCloseGameDialogOpen = ko.observable(false);
    self.isInviteGameDialogOpen = ko.observable(false);
    self.openInviteGameDialog = ko.observable(false);
    self.inviteGameDialogText = ko.observable('');
    self.opponentNameOfGameToBeClosed = ko.observable('');
    self.invitesAvailable = ko.observableArray([]);

    self.switchToGame = function(game) {
      _currentGame = game;
      localStorage.setItem('currentGameId', game._id);
    };

    self.changeInvitesAccepted = function() {
      lobbySocket.emit('setInvitesAccepted', self.invitesAccepted());
    };

    self.emitResignGame = function(game) {
      lobbySocket.emit('resignGame', game._id);
    };

    self.sendChatInput = function() {
      if(_currentGame) {
        lobbySocket.emit('addChatMessage', {gameId: _currentGame._id, message: self.chatInput()});
        self.chatInput('');
      } else {
        // TODO display error
        console.log('no chat selected');
      }
    };

    self.openCloseGameDialog = function() {
      self.isCloseGameDialogOpen(true);
      _gameToBeClosed = this;
      self.opponentNameOfGameToBeClosed(this.opponentName);
    };

    self.openInviteGameDialog = function() {
      self.invitesAvailable([]);
      self.isInviteGameDialogOpen(true);
      _playerInvited = this;
      switch(_playerInvited.invitesAccepted) {
        case 'all':
          self.inviteGameDialogText("Player wants to play any game.");
          self.invitesAvailable.push({id: 'random', label: 'Random'});
          self.invitesAvailable.push({id: 'dark', label: 'Dark'});
          self.invitesAvailable.push({id: 'light', label: 'Light'});
        break;
        case 'light':
          self.inviteGameDialogText("Player wants to play light only.");
          self.invitesAvailable.push({id: 'dark', label: 'Dark'});
        break;
        case 'dark':
          self.inviteGameDialogText("Player wants to play dark only.");
          self.invitesAvailable.push({id: 'light', label: 'Light'});
        break;
        case 'none':
          self.inviteGameDialogText("Player doesn't accept invites.");
        break;
      }
    };

    self.requestGame = function(mySide) {
      var gameRequestEvent = new events.GameRequest({
        opponentName: _playerInvited.invitesAccepted,
        mySide: mySide
      });
      if(!gameRequestEvent.isValid) {
        lobbySocket.emit('requestGame', gameRequestEvent.json);
      } else {
        console.log('trying to send not valid event');
      }
    };

    self.emitRequestGame = null;
    self.emitChangeMyPlayerName = null;
    
    var findGame = function(gameId) {
      var correspondingGame;
      var allGames = self.games();
      var i;
      for(i=0; i<allGames.length; i++) {
        if(allGames[i]._id === gameId) {
          correspondingGame = allGames[i];
          break;
        }
      }
      return correspondingGame;
    };

    self.onSetInvitesAccepted = function(invitesAccepted) {
      self.invitesAccepted(invitesAccepted);
      return self.onSetInvitesAccepted;
    };

    self.onSetChatLog = function(log) {
      var correspondingGame = findGame(log.gameId);
      if(typeof correspondingGame !== "undefined") {
        correspondingGame.messages(log.log);
      } else {
        console.log("received a chat log for a non-existing game");
        console.log(log);
      }
      return self.onSetChatLog;
    };

    self.onAddGame = function(game) {
        game.messages = ko.observableArray([]);
        self.games.push(game);
        if(localStorage.getItem('currentGameId') === game._id) {
          _currentGame = game;
          self.activeTab(-1);
        }
        require('./game/Canvas/canvasBoardManager.js')(game._id);

        lobbySocket.emit('requestChatLog', game._id);
        console.log(game);
    };

    self.onAddChatMessage = function(chat) {
      var game = findGame(chat.gameId);
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

    self.onAddPlayerName = function(data) {
      var player = new events.Player(data);
      self.players.push(player);
      return self.onAddPlayerName;
    };

    self.onRemovePlayerName = function(data) {
      var player = new events.Player(data);
      self.players.remove(
        function(playerIt) {
          return playerIt.playerName === player.playerName;
        }
      );
      return self.onRemovePlayerName;
    };

    self.onSetMyPlayerName = function(data) {
      var player = new events.Player(data);
      self.myPlayerName(player.playerName);
      return self.onSetMyPlayerName;
    };

    self.onRemoveGame = function(gameId) {
      self.games.remove(
        function(gameIt) {
          return gameIt._id === gameId;
        }
      );
      if(gameId === _currentGame._id) {
        _currentGame = null;
        localStorage.removeItem('currentGameId');
      }
      return self.onRemoveGame;
    };
      
    self.onRequestGame = function(data) {
      var inviteToPlayer = new events.InviteToPlayer(data);
      $.pnotify({
        title: 'Game Request',
        text: inviteToPlayer.opponentName + ' requested a game. ' +
        'He wants to play: ' + inviteToPlayer.opponentSide + '. ' +
        '<a href="#" id="acc' + encodeURI(inviteToPlayer.opponentName) + '">Accept</a>.'
      });
      $("a[id=acc" + encodeURI(inviteToPlayer.opponentName) + "]").click(function(){
        lobbySocket.emit('acceptGame', data);
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
      var newPlayer = new events.Player(data);
      if(newPlayer.isSelf === false) {
        self.onAddPlayerName(newPlayer);
      } else {
        self.onSetMyPlayerName(newPlayer);
        self.onSetInvitesAccepted(newPlayer.invitesAccepted);
      }
      return self.onAddNewPlayer;
    };

    self.onSetShouldShowPage = function(data) {
      var shouldShowPage = new events.ShouldShowPage(data);
      self.shouldShowPage(shouldShowPage.bool);
      $("#blockingMsg").text(shouldShowPage.err);
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
            lobbySocket.on(eventName, self[prop]);
          }
        }
      }
    };

    self.bindSocketEmitters = function() {
      var prop;
      var eventName;
      var makeSocketEmitter = function(eventName, objectToEmit) {
        var _eventName = eventName;
        (function(){lobbySocket.emit(_eventName, objectToEmit);}());
      };

      for(prop in self) {
        if(self.hasOwnProperty(prop)) {
          if(prop.match(/^emit/) && self[prop] === null) {
            eventName = prop[4].toLowerCase() + prop.slice(5);
            self[prop] = makeSocketEmitter.bind(self, eventName);
          }
        }
      }
    };
}

$(function() {
  $.pnotify.defaults.styling = "jqueryui";

  ko.bindingHandlers.playerOnline = {
      update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var players = ko.utils.unwrapObservable(valueAccessor());
        var isPlayerOnline = _.any(players, function(player) {
           return player.playerName === bindingContext.$data.opponentName;
        });
        element.style.visibility = isPlayerOnline ? "visible" : "hidden";
      }
  };

  var appViewModel = new AppViewModel(lobbySocket);
  appViewModel.bindSocketEmitters();
  ko.applyBindings(appViewModel);
  appViewModel.bindSocketHandlers();
});
