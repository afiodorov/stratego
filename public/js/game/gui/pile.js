'use strict';
/*jslint node: true*/

var LinkedObjects = require('./fabric/linkedObjects.js');
var _ = require('lodash');
var fabric = require('fabric').fabric;

/**
 * @constructor
 * @param {fabric.Canvas} canvas reference
 * @param {array} elements Initial elements in the pile
 * @param {struct} parameters
 */
var Pile = function(canvas, elements, parameters) {
  var self = this;

  var defaults = _.partialRight(_.assign, function(a, b) {
    return (a === undefined) ? b : a;
  });

  var defaultValues = {
    topOfset: 0,
    leftOfset: 0,
    left: 0,
    top: 0,
    capacity: 0
  };

  _.assign(this, defaults(_.clone(parameters), defaultValues));

  this.gui = new LinkedObjects(_.pluck(elements, 'gui'));
  this.gui.forEachObject(function(element) {
    element.setTop(self.top);
    element.setLeft(self.left);
  });

  _.range(0, elements.length).forEach(function(elNum) {
    var fabricObject = elements[elNum].gui;
    fabricObject.setTop(fabricObject.getTop() + self.topOfset * elNum);
    fabricObject.setLeft(fabricObject.getLeft() + self.leftOfset * elNum);
  });

  this.canvas = canvas;
  _.assign(this, parameters);
};

/**
 * @param {object} element Adds an element to the pile
 */
Pile.prototype.add = function(element) {
  console.log(element);
};

/**
 * @param {object} element Removes an element from the pile
 * @return {object} removed element
 */
Pile.prototype.remove = function(element) {
  var self = this;
  var elIndex = this.elements.indexOf(element);

  if (elIndex === -1) {
    throw new Error('out of bounds');
  }

  this.elements.splice(elIndex);

  this.gui.remove(element.gui);

  // +1 since
  _.range(elIndex, this.elements.length + 1).forEach(
    function(i) {
      self.gui.item(i).animate('top', '-=' + self.topOfset.toString(), {
        onChange: self.canvas.renderAll.bind(self.canvas)
      });
      self.gui.item(i).animate('left', '-=' + self.leftOfset.toString(), {
        onChange: self.canvas.renderAll.bind(self.canvas)
      });
    });

  return element;
};

/**
 */
module.exports = Pile;
