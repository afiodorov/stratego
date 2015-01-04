/*jslint node: true*/
'use strict';
var fabric = require('fabric').fabric;
var _ = require('lodash');

var LinkedObjects = fabric.util.createClass(fabric.Object, fabric.Collection, {
  type: 'linkedobjects',
  initialize: function(objects) {
    this._objects = objects || [];
    this.callSuper('initialize');
  }
});

/**
 */
module.exports = LinkedObjects;
