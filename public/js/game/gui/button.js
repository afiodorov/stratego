'use strict';
/*jslint node: true*/

var dimensions = require('./dimenstion.js');
var _ = require('lodash');

var fabric = require('fabric').fabric;

/**
 * @constructor
 * @param {fabric.canvas} canvas
 * @param {string} imgElement
 * @param {object} paramArgs
 */
var Button = function(canvas, imgElement, paramArgs) {
  this.canvas = canvas;

  var defaults = _.partialRight(_.assign, function(a, b) {
    return (a === undefined) ? b : a;
  });

  var defaultValues = {
    width: dimensions.BUTTON_WIDTH,
    height: dimensions.BUTTON_HEIGHT,
    selectable: false,
    hoverCursor: 'pointer'
  };

  var params = defaults(_.clone(paramArgs), defaultValues);

  this.fabricObj = new fabric.Image(imgElement, params);
  this.fabricObj.holder = this;

  this.fabricObj.hoverCursor = 'pointer';
};

/**
 */
Button.prototype.hide = function() {
  this.fabricObj.setOpacity(0);
  this.canvas.renderAll();
};

/**
 */
Button.prototype.show = function() {
  this.fabricObj.setOpacity(1);
  this.canvas.renderAll();
};

/**
 */
module.exports = Button;
