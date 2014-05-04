/*global describe,assert,it*/
'use strict';
var assert = require('assert');
var events = require('../../public/js/events.js');

describe('events', function() {
  it('json conversion', function() {
  var inviteEvent = new events.InviteFromPlayer(
      {opponentName: 'tom', mySide: 'light'});
      assert.deepEqual(inviteEvent.json,
        {opponentName: 'tom', mySide: 'light'});
  });
  it('isValid in event', function() {
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
