/*global location, localStorage*/
'use strict';
var io = require('socket.io-client');
var _ = require('lodash');
var $ = require('jquery');
require('jquery-ui');
require('pnotify');

var ko = require('knockout');
require('knockout-jqueryui');

var lobbySocket = io(location.origin + '/lobby');
var events = require('./events.js');
var errors = require('./errors.js');
var GameManager = require('./game/GameManager.js');
var Progress = require('./game/progress.js');
var side = require('./game/structs/side.js');
var stage = require('./game/structs/stage.js');

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

    self.emitResignGame = function(game) {
      lobbySocket.emit('resignGame', game._id);
    };

    self.sendChatInput = function() {
      if(_currentGame) {
        var chatMessage = new events.ChatMessageToServer(
        {
          gameId: _currentGame._id,
          message: self.chatInput()
        });
        if(chatMessage.isValid) {
          lobbySocket.emit('addChatMessage', chatMessage);
          self.chatInput('');
        } else {
          console.log(errors.EMIT_NOT_VALID_EVENT);
        }
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

    // this call is bound to a player in self.players
    self.openInviteGameDialog = function() {
      self.invitesAvailable([]);
      self.isInviteGameDialogOpen(true);
      _playerInvited = this;
      switch(_playerInvited.invitesAccepted) {
        case 'all':
          self.inviteGameDialogText("Player wants to play any game.");
          self.invitesAvailable.push({id: 'random', label: 'Random'});
          self.invitesAvailable.push({id: side.DARK, label: 'Dark'});
          self.invitesAvailable.push({id: side.LIGHT, label: 'Light'});
        break;
        case side.LIGHT:
          self.inviteGameDialogText("Player wants to play light only.");
          self.invitesAvailable.push({id: side.DARK, label: 'Dark'});
        break;
        case side.DARK:
          self.inviteGameDialogText("Player wants to play dark only.");
          self.invitesAvailable.push({id: side.LIGHT, label: 'Light'});
        break;
        case 'none':
          self.inviteGameDialogText("Player doesn't accept invites.");
        break;
      }
    };

    self.requestGame = function(mySide) {
      var inviteFromPlayer = new events.InviteFromPlayer({
        opponentName: _playerInvited.playerName,
        mySide: mySide
      });
      if(inviteFromPlayer.isValid) {
        lobbySocket.emit('requestGame', inviteFromPlayer.json);
      } else {
        console.log(errors.EMIT_NOT_VALID_EVENT);
        console.log('requestGame');
        console.log(inviteFromPlayer);
      }
    };

    self.emitRequestGame = null;
    self.emitChangeMyPlayerName = null;
    self.emitChangeInvitesAccepted = null;

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
      if(correspondingGame !== undefined) {
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
        lobbySocket.emit('requestChatLog', game._id);

        var gameManager = new GameManager();
        gameManager.setCanvasId(game._id);
        gameManager.setProgress(new Progress(game, gameManager));
        gameManager.registerRules(gameManager.progress);
        gameManager.initialiseGui();
    };

    self.onAddChatMessage = function(uChat) {
      var chatMessage = new events.ChatMessageFromServer(uChat);
      if(!chatMessage.isValid) {
        console.log(errors.RECEIVED_NOT_VALID_EVENT);
        return;
      }

      var game = findGame(chatMessage.gameId);
      if(typeof game === 'undefined') {
        console.log('received a chat message to an non-existing game');
        return self.onAddChatMessage;
      }

      if(game.messages().length > 20) {
        game.messages.shift();
      }

      game.messages.push(chatMessage);
    };

    self.onAddPlayerName = function(playerData) {
      var uPlayer = new events.Player(playerData);
      if(uPlayer.isValid) {
        var player = uPlayer;
        self.players.push(player);
      } else {
        console.log(errors.RECEIVED_NOT_VALID_EVENT);
      }
    };

    self.onRemovePlayerName = function(playerData) {
      var uPlayer = new events.RemovePlayer(playerData);
      if(!uPlayer.isValid) {
        console.log(errors.RECEIVED_NOT_VALID_EVENT);
        return;
      }
      var player = uPlayer;

      self.players.remove(
        function(playerIter) {
          return playerIter.playerName === player.playerName;
        }
      );
    };

    self.onSetMyPlayerName = function(playerData) {
      var uPlayer = new events.Player(playerData);
      if(!uPlayer.isValid) {
        console.log(errors.RECEIVED_NOT_VALID_EVENT);
        return;
      }
      var player = uPlayer;
      self.myPlayerName(player.playerName);
    };

    self.onRemoveGame = function(gameId) {
      self.games.remove(
        function(gameIt) {
          return gameIt._id === gameId;
        }
      );
      if(_currentGame && gameId === _currentGame._id) {
        _currentGame = null;
        localStorage.removeItem('currentGameId');
      }
    };

    self.onRequestGame = function(inviteData) {
      var uInviteToPlayer = new events.InviteToPlayer(inviteData);
      if(!uInviteToPlayer.isValid) {
        console.log(errors.RECEIVED_NOT_VALID_EVENT);
        return;
      }
      var inviteToPlayer = uInviteToPlayer;

      var displaySide;
      try {
        displaySide = side.display(inviteToPlayer.opponentSide);
      } catch (e) {
        if (e.name === 'UnknownSide') {
          displaySide = inviteToPlayer.opponentSide;
        } else {
          throw e;
        }
      }

      $.pnotify({
        title: 'Game Request',
        text: inviteToPlayer.opponentName + ' requested a game. ' +
        'He wants to play: ' + displaySide + '. ' +
        '<a href="#" id="acc' + encodeURI(inviteToPlayer.opponentName) + '">Accept</a>.'
      });
      $("a[id=acc" + encodeURI(inviteToPlayer.opponentName) + "]").click(function(){
        lobbySocket.emit('acceptGame', inviteToPlayer.json);
      return false;});
    };

    self.onGameStarted = function(game) {
        $.pnotify({
          title: 'New Game started',
          text: game.playerName + ' started a game with you!'
        });
    };

    self.onFailChangingName = function(data) {
      $.pnotify({
        title: 'Couldn\'t change user name',
        text: data,
        type: 'error',
        icon: false
      });
    };

    self.onOpponentResigned = function(opponentName) {
      $.pnotify({
        title: 'Game finished',
        text: opponentName + ' has quit the game.',
        type: 'success',
        icon: 'ui-icon ui-icon-flag'
        });
    };

    self.onAddNewPlayer = function(data) {
      var newPlayer = new events.Player(data);
      if(newPlayer.isSelf === false) {
        self.onAddPlayerName(newPlayer);
      } else {
        self.onSetMyPlayerName(newPlayer);
        self.onSetInvitesAccepted(newPlayer.invitesAccepted);
      }
    };

    self.onSetShouldShowPage = function(data) {
      var uShouldShowPage = new events.ShouldShowPage(data);
      if(!uShouldShowPage.isValid) {
        console.log(errors.RECEIVED_NOT_VALID_EVENT);
        return;
      }
      var shouldShowPage = uShouldShowPage;

      self.shouldShowPage(shouldShowPage.bool);
      $("#blockingMsg").text(shouldShowPage.err);
      $("#blockingMsg").dialog({
         closeOnEscape: false,
         open: function(event, ui)
                {$(".ui-dialog-titlebar-close", $(this).parent()).hide();}
      });
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
        lobbySocket.emit(eventName, objectToEmit);
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
