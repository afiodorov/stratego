'use strict';
var logger = require('../lib/logger');
var Game = require('./../models/Game.js');
var gameutils = require('./../models/utils/gameutils.js');

/**
 *
 */
function start(opponent, opsession, opponentSide) {
  var socket = this.socket;
  var session = this.session;
  Game.create(opponent.sid, socket.sid, opponentSide).
    then(function(game) {
      opponent.socket.join(game.id);
      socket.join(game.id);
      socket.emit('gameStarted', {playerName: opsession.playerName});
      opponent.socket.emit('gameStarted',
        {playerName: session.playerName});
      var serverGameState = game.toObject();

      gameutils.getClientStateJson(serverGameState, socket.sid).then(function(state) {
        socket.emit('addGame', state);
      }).fail(function(err) {
        logger.log('warn', 'couldn\'t update about new game');
        logger.log('warn', err);
      }).done();

      gameutils.getClientStateJson(serverGameState, opponent.sid).then(function(state) {
        opponent.socket.emit('addGame', state);
      }).fail(function(err) {
        logger.log('warn', 'failed to updated opponent\'s new game');
        logger.log('warn', err);
      }).done();
    }).fail(function(err) {
      logger.log('warn', "failed to add game");
      logger.log('warn', err);
    }).done();
}


function playCard(game) {

}

function movePiece(game) {

}

function main() {
  this.socket.on('playCard', playCard.bind(this));
  this.socket.on('movePiece', movePiece.bind(this));
}

module.exports = {
  registerHandlers: main
};
