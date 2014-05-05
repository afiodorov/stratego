'use strict';
var logger = require('../lib/logger');
var Game = require('./../models/Game.js');
var gameutils = require('./../models/utils/gameutils.js');
var pieces = require('./../public/js/game/structs/pieces.js');
var _ = require('./../public/js/lib/lodash.js');
var logic = require('./../public/js/game/logic.js');
var side = require('./../public/js/game/structs/side.js');
var Client = require('./structs/client.js');

function start(opponentClient, opsession, opponentSide) {
  var socket = this.socket;
  var session = this.session;
  var client = new Client(socket, socket.sid);

  Game.create(opponentClient.sid, socket.sid, opponentSide)
    .then(function(gameInstance) {
      socket.join(gameInstance._id);
      socket.emit('gameStarted', {playerName: opsession.playerName});
      opponentClient.socket.emit('gameStarted',
        {playerName: session.playerName});

      [client, opponentClient].forEach(function(client) {
        gameInstance.getClientStateJson(client.sid).then(function(clientJson) {
          client.socket.emit('addGame', clientJson);
        }).fail(function(err) {
          logger.log('warn', 'can not start a game');
          logger.log('warn', err);
        });
      });
  });
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
  registerHandlers: main,
  start: start
};
