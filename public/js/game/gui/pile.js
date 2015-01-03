/*global module*/
'use strict';
var PileGui = require('./fabric/pile.js');
var _ = require('lodash');

var Pile = function(canvas, capacity, elements, topOfset, leftOfset) {
  this.gui = new PileGui(_.pluck(elements, 'gui'), topOfset, leftOfset);
  this.canvas = canvas;
  this.capacity = capacity;
};

Pile.prototype.add = function(element) {

};

Pile.prototype.remove = function(element) {

};

module.exports = Pile;
