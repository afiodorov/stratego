'use strict';
/*jslint node: true*/

var logger = require('../lib/logger');
var Game = require('./../models/Game.js');
var AddGameEvent = require('./../public/js/events/addGame.js');
var pieces = require('./../public/js/game/structs/pieces.js');
var _ = require('lodash');
var side = require('./../public/js/game/structs/side.js');
var Client = require('./structs/client.js');

/**
 * @this {ActiveSession}
 * @param {Client} opponentClient
 * @param {string} opsession
 * @param {structs.Side|'random'} opponentSide
 */
function start(opponentClient, opsession, opponentSide) {
  /*jshint validthis: true*/
  var self = this;

  var socket = self.socket;
  var session = self.session;
  var client = new Client(socket, socket.sid);

  if (opponentSide === 'random') {
    opponentSide = side.random();
  }

  Game.create([
    {
      sid: client.sid,
      side: side.opposite(opponentSide),
      name: session.playerName
    },
    {
      sid: opponentClient.sid,
      side: opponentSide,
      name: opsession.playerName
    }
  ]).then(function(gameInstance) {
      socket.emit('gameStarted', {playerName: opsession.playerName});
      opponentClient.socket.emit('gameStarted',
        {playerName: session.playerName});

      [client, opponentClient].forEach(function(client) {
        var gameEvent = gameInstance.getAddGameEvent(client.sid);
        client.socket.join(gameInstance.id);

        if (gameEvent.isValid) {
          client.socket.emit('addGame', gameEvent.json);
        } else {
          logger.log('warn', 'invalid game event', gameEvent);
        }
      });
  });
}

/**
 */
module.exports = {
  start: start
};
