'use strict';
/*jslint node: true*/

var clients = [];
var Q = require('q');
var lobbyutils = require('./../lib/lobbyutils.js');
var makeStruct = require('../public/js/lib/structFactory.js');
var Client = require('./structs/client.js');
var InviteRecord = makeStruct('opponentSid mySide');
var Game = require('./../models/Game.js');
var Session = require('./../models/Session.js');
var gameSocketHandler = require('./game.js');
var _ = require('lodash');
var events = require('./../public/js/events.js');
var side = require('./../public/js/game/structs/side.js');

// first one is default
var invitesAllowed = _.values(side).concat(['all', 'random']);

var logger = require('../lib/logger');

function disconnect() {
  /*jshint validthis:true */
  var self = this;

  self.io.of('/lobby').emit('removePlayerName',
    {playerName: self.session.playerName});
}

function resignGame(gameId) {
  /*jshint validthis:true */
  var self = this;

  var io = self.io;
  var socket = self.socket;
  var session = self.session;
  Game.findOne(gameId, self.session.id).then(function(game) {
    if (game) {
      game.remove();
      io.of('/lobby'). in (gameId).emit('removeGame', gameId);
      socket.broadcast.to(gameId).emit('opponentResigned', session.playerName);
    } else {
      throw new Error('can not find game');
    }
  }).fail(function(err) {
    logger.log('warn', 'can not find game');
    console.log(err);
  });
  require('../models/Chat.js').removeMessages(gameId);
}


function requestGame(uInvite) {
  /*jshint validthis:true */
  var self = this;

  var session = self.session;
  var inviteFromPlayer = new events.InviteFromPlayer(uInvite);
  if (!inviteFromPlayer.isValid) {
    return;
  }
  try {
    var opponentClient = clients[inviteFromPlayer.opponentName];
    if (!opponentClient) {
      logger.log('info', 'couldn\'t find an opponent');
      return;
    }
    Session.get(opponentClient.sid).then(function(opSession) {
      if (opSession.acceptedInvites === 'none') {
        logger.log('info', 'invite not accepted: none accepted');
        return;
      }

      if (opSession.acceptedInvites === side.DARK &&
        inviteFromPlayer.mySide !== side.LIGHT) {
          logger.log('info', 'invite not accepted: dark accepted');
          return;
      }

      if (opSession.acceptedInvites === side.LIGHT &&
        inviteFromPlayer.mySide !== side.DARK) {
          logger.log('info', 'invite not accepted: light accepted');
          return;
      }

      opponentClient.socket.emit('requestGame',
        {opponentName: session.playerName,
          opponentSide: inviteFromPlayer.mySide});
    });
    if (session.invites === undefined) {
      session.invites = [];
    }
    // I am inviting the opponent to the game
    var inviteRecord = new InviteRecord(opponentClient.sid,
      inviteFromPlayer.mySide);

    if (!_.findWhere(session.invites, inviteRecord)) {
      session.invites.push(inviteRecord);
      session.save();
    }
  } catch (e) {
    logger.log('warn', 'can\'t fetch the game');
    logger.log('warn', e);
  }
}

function acceptGame(uInvite) {
  /*jshint validthis:true */
  var self = this;

  var inviteToPlayer = new events.InviteToPlayer(uInvite);
   if (!inviteToPlayer.isValid) {
    return;
  }
  var socket = self.socket;

  var opponentClient = clients[inviteToPlayer.opponentName];
  Session.get(opponentClient.sid).then(function(opsession) {
    var i;
    var inviteRecordIndex = -1;
    var inviteRecord;
    for (i = 0; i < opsession.invites.length; i++) {
      inviteRecord = opsession.invites[i];
      if (inviteRecord.opponentSid === socket.sid &&
        inviteRecord.mySide === inviteToPlayer.opponentSide) {
          inviteRecordIndex = i;
          break;
      }
    }

    var wasInvited = (inviteRecordIndex !== -1);
    if (wasInvited) {
      gameSocketHandler.start.call(self, opponentClient, opsession,
        inviteToPlayer.opponentSide);

      opsession.invites.splice(inviteRecordIndex, 1);
      Session.saveNew(opponentClient.sid, opsession);
    } else {
      socket.emit('error', 'The player has not invited you.');
    }
  }).fail(function(err) {
    logger.log('warn', 'failed to fetch the opponent from db');
    logger.log('warn', err);
  });
}

function _initialisePlayer() {
  /*jshint validthis:true */
  var self = this;

  if (!self.session.invitesAccepted) {
    self.session.invitesAccepted = invitesAllowed[0];
    self.session.save();
  }
}

function _isNewClient() {
  /*jshint validthis:true */
  var self = this;

  return (self.session.playerName === undefined);
}

function _joinGameRooms() {
  /*jshint validthis:true */
  var self = this;

  var socket = self.socket;
  var session = self.session;
  Game.getAll(session.id).then(function(games) {
    games.forEach(function(game) {
      socket.join(game.id);
    });
  }).fail(function(err) {
    logger.log('error', 'problem fetching games for the session');
    logger.log('error', err);
  });
}

function _setSocketPlayerName(clients) {
  /*jshint validthis:true */
  var self = this;

  if ((self.session.playerName === undefined) ||
        // check for duplicate name in the db of sessions
        ((clients.indexOf(self.session.playerName) !== -1) &&
          (self.socket.sid !== clients[self.session.playerName].sid))) {
    self.session.playerName = lobbyutils.genUniquePlayerName(clients);
    self.session.save();
  }

}

function _checkForDuplicateSession() {
  return;
  //var socket = this.socket;

  //var isDuplicateTab = false;
  //onlineClients.forEach(function(client) {
    //if ((client.id !== socket.id) && client.sid === socket.sid) {
      //// break the loop as well for efficiency!
      //isDuplicateTab = true;
    //}
  //});

  //if(isDuplicateTab) {
    //socket.json.emit('setShouldShowPage', {bool: false, err: "This page is
    //already"
    //+ " open in one of your tabs. Please close duplicate tabs and refresh."});
    //// socket.close();
    //return;
  //}
}

function _sendListOfGames() {
  /*jshint validthis:true */
  var self = this;

  var socket = self.socket;
  Game.getAll(self.socket.sid)
    .then(function(games) {
      games.forEach(function(game) {
        var gameEvent = game.getAddGameEvent(socket.sid);

        if (gameEvent.isValid) {
          socket.emit('addGame', gameEvent.json);
        } else {
          logger.log('warn', 'invalid game event', gameEvent);
        }
      });
  }).done();
}

function _buildPlayerEvent(session, isSelf) {
  return new events.Player({
      playerName: session.playerName,
      invitesAccepted: session.invitesAccepted,
      isSelf: isSelf
    });
}

function _sendListOfPlayers(onlineClients) {
  /*jshint validthis:true */
  var self = this;

  var socket = self.socket;
  onlineClients.forEach(function(client) {
    var isSelf = (client.sid === socket.sid);
    Session.get(client.sid).then(function(session) {
      socket.emit('addNewPlayer', _buildPlayerEvent(session, isSelf));
    });
  });
}

function changeMyPlayerName(playerName) {
  /*jshint validthis:true */
  var self = this;

  var socket = self.socket;
  var session = self.session;

  if (!playerName) {
    socket.emit('failChangingName', 'No player name provided');
    return;
  }

  if (clients.indexOf(playerName) !== -1) {
    socket.emit('failChangingName', 'Duplicate player name');
    return;
  }

  delete clients[session.playerName];
  socket.broadcast.emit('removePlayerName', _buildPlayerEvent(session, false));
  socket.emit('removePlayerName', _buildPlayerEvent(session, true));
  session.playerName = playerName;
  session.save();
  clients[session.playerName] = new Client(socket, socket.sid);
  socket.broadcast.emit('addNewPlayer', _buildPlayerEvent(session, false));
  socket.emit('addNewPlayer', _buildPlayerEvent(session, true));
}

function changeInvitesAccepted(invitesAccepted) {
  /*jshint validthis:true */
  var self = this;

  var socket = self.socket;
  var session = self.session;
  if (invitesAccepted && invitesAllowed.indexOf(invitesAccepted) !== -1) {
    session.invitesAccepted = invitesAccepted;
    session.save();
    socket.emit('setInvitesAccepted', invitesAccepted);
    socket.broadcast.emit('removePlayerName',
      _buildPlayerEvent(session, false));
    socket.emit('removePlayerName', _buildPlayerEvent(session, true));
    socket.broadcast.emit('addNewPlayer', _buildPlayerEvent(session, false));
    socket.emit('addNewPlayer', _buildPlayerEvent(session, true));
  }
}


function connect() {
  /*jshint validthis:true */
  var self = this;

  var socket = self.socket;
  var session = self.session;
  var io = self.io;

  socket.sid = session.id;
  socket.session = session;

  var onlineClients = _.values(io.of('/lobby').connected);
  // each game has a corresponding socket room
  _joinGameRooms.call(self);
  _checkForDuplicateSession.call(self, onlineClients);
  _setSocketPlayerName.call(self, clients);
  _initialisePlayer.call(self);
  _sendListOfGames.call(self);
  _sendListOfPlayers.call(self, onlineClients);

  clients[session.playerName] = new Client(socket, session.id);
  socket.broadcast.emit('addNewPlayer', _buildPlayerEvent(session, false));
}


function main() {
  /*jshint validthis:true */
  var self = this;

  connect.call(self);
  self.socket.on('changeMyPlayerName', changeMyPlayerName.bind(self));
  self.socket.on('requestGame', requestGame.bind(self));
  self.socket.on('acceptGame', acceptGame.bind(self));
  self.socket.on('resignGame', resignGame.bind(self));
  self.socket.on('changeInvitesAccepted', changeInvitesAccepted.bind(self));
  self.socket.on('disconnect', disconnect.bind(self));
}

/**
 */
module.exports = {
  registerHandlers: main
};
