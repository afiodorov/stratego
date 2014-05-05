'use strict';
var logger = require('../lib/logger');
var Game = require('./../models/Game.js');
var gameutils = require('./../models/utils/gameutils.js');
var pieces = require('./../public/js/game/structs/pieces.js');
var _ = require('./../public/js/lib/lodash.js');
var logic = require('./../public/js/game/logic.js');
var side = require('./../public/js/game/structs/side.js');

/**
 *
 */
function start(opponentClient, opsession, opponentSide) {
  var socket = this.socket;
  var session = this.session;

  Game.create(opponentClient.sid, socket.sid, opponentSide)
    .then(function(gameInstance) {
    console.log(gameInstance.getClientStateJson());
  });

  opponentClient.socket.emit('addGame', {
    _id: 1,
    opponentName: session.playerName,
    gameState: {
      requiredInteraction: 'chooseStartingPositions',
      friendlyPieces: logic.randomStartPositions(side.DARK).map(
        _.property('name')).map(_.partial(_.object, ['name'])),
      enemyPieces: logic.randomStartPositions(side.LIGHT).map(
        _.property('position')).map(_.partial(_.object, ['position']))
    }
  });

  socket.emit('addGame', {
    _id: 1,
    opponentName: opsession.playerName,
    gameState: {
      requiredInteraction: 'chooseStartingPositions',
      friendlyPieces: logic.randomStartPositions(side.LIGHT).map(
        _.property('name')).map(_.partial(_.object, ['name'])),
      enemyPieces: logic.randomStartPositions(side.DARK).map(
        _.property('position')).map(_.partial(_.object, ['position']))
      }
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
