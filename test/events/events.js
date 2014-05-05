/*global describe,assert,it*/
'use strict';
var assert = require('assert');
var events = require('./../../public/js/events.js');
var interactions = require('./../../public/js/game/structs/interactions.js');
var _ = require('../../public/js/lib/lodash.js');

describe('events', function() {
  it('json conversion', function() {
  var inviteEvent = new events.InviteFromPlayer(
      {opponentName: 'tom', mySide: 'light'});
      assert.deepEqual(inviteEvent.json,
        {opponentName: 'tom', mySide: 'light'});
  });
  it('isValid of events works', function() {
    var inviteToPlayer = new events.InviteToPlayer({
      opponentName: 'tom',
      opponentSide: 'dark'
    });
    assert.equal(inviteToPlayer.isValid, true);

    var inviteToPlayerInvalid = new events.InviteToPlayer({
      opponentName: 'tom'
    });

    assert.equal(inviteToPlayerInvalid.isValid, false);
  });
});

describe('game', function() {
  it('json conversion to game', function() {
    var game = {
     opponentName: 'john',
     _id: '305_',
     state: {
       requiredInteraction: interactions.chooseStartingPositions,
       enemyPieces: [
         {
           position: {
            col: 3,
            row: 0
           }
         },
         {
           position: {
            col: 2,
            row: 2
           }
         }
       ],
       friendlyPieces: [
         {
           name: 'warg'
         },
         {
          name: 'orcs'
         }
       ]
     }
    };

    var gameEvent = new events.Game(game);
    console.log(gameEvent);
  });
});
