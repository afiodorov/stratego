/*global describe, it*/
'use strict';
var events = require('../../public/js/events.js');

describe('events', function() {
  it('json conversion', function() {
  var inviteEvent = new events.InviteFromPlayer(
      {opponentName: 'tom', opponentSide: 'light'});

    var prop;
    for(prop in inviteEvent.json) {
      console.log(prop);
    }
  });
});
