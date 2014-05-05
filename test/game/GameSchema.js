/*global describe, it*/
'use strict';
var assert = require('assert');
var _ = require('../../public/js/lib/lodash.js');
var Game = require('../../models/Game.js');

//describe('#omitPiecesProperty', function() {
  //var gameJson = {
    //state: {
      //pieces: [
        //{
          //name: 'baromir',
          //position: {col: 0, row: 0},
          //ownerSid: '35'
        //},
        //{
          //name: 'gandalf',
          //position: {col: 1, row: 0},
          //ownerSid: '35'
        //}
      //]
    //}
  //};

  //var piecesWithoutPosition = [
    //{
      //name: 'baromir',
      //ownerSid: '35'
    //},
    //{
      //name: 'gandalf',
      //ownerSid: '35'
    //}
  //];

  //var piecesWithoutName = [
  //{
      //position: {col: 0, row: 0},
      //ownerSid: '35'
    //},
    //{
      //position: {col: 1, row: 0},
      //ownerSid: '35'
    //}
  //];

  //it('should remove property', function() {
    //assert.deepEqual(
      //Game.Schema.methods.omitPiecesProperty.call(
        //gameJson, '35', 'position'),
      //piecesWithoutPosition);

    //assert.deepEqual(
      //Game.Schema.methods.omitPiecesProperty.call(
        //gameJson, '35', 'name'),
      //piecesWithoutName);
  //});
//});
