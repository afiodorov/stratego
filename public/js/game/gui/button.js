'use strict';
/*jslint node: true*/

var dimensions = require('./dimenstion.js');
var _ = require('lodash');

var fabric = require('fabric').fabric;

/**
 * @constructor
 * @param {string} imgElement
 * @param {object} paramArgs
 */
var Button = function(imgElement, paramArgs) {
  var defaults = _.partialRight(_.assign, function(a, b) {
    return (a === undefined) ? b : a;
  });

  var defaultValues = {
    width: dimensions.BUTTON_WIDTH,
    height: dimensions.BUTTON_HEIGHT
  };

  var params = defaults(_.clone(paramArgs), defaultValues);

  this.fabricObj = new fabric.Image(imgElement, params);
};

/**
 */
Button.prototype.hide = function() {
  this.fabricObj.setOpacity(0);
};

/**
 */
Button.prototype.show = function() {
  this.fabricObj.setOpacity(1);
};

/**
 */
module.exports = Button;
