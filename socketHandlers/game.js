'use strict';
/*jslint node: true*/

var logger = require('../lib/logger');
var Game = require('./../models/Game.js');
var AddGameEvent = require('./../public/js/events/addGame.js');
var gameutils = require('./../models/utils/gameutils.js');
var pieces = require('./../public/js/game/structs/pieces.js');
var _ = require('lodash');
var logic = require('./../public/js/game/logic.js');
var side = require('./../public/js/game/structs/side.js');
var Client = require('./structs/client.js');

/**
 * @this {ActiveSession}
 */
function start(opponentClient, opsession, opponentSide) {
  var socket = this.socket;
  var session = this.session;
  var client = new Client(socket, socket.sid);

  if(opponentSide === 'random') {
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

        if(gameEvent.isValid) {
          client.socket.emit('addGame', gameEvent.json);
        } else {
          logger.log('warn', 'invalid game event', gameEvent)
        }
      });
  });
}

function main() {
}

/**
 */
module.exports = {
  registerHandlers: main,
  start: start
};
