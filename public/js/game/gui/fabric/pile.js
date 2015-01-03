/*jslint node: true*/
'use strict';
var fabric = require('fabric').fabric;

var Pile = fabric.util.createClass(fabric.Group, {
  initialize: function(elements, topOfset, leftOfset) {
    this.topOfset = topOfset;
    this.leftOfset = leftOfset;

    var elemNum;


    for (elemNum = 0; elemNum < elements.length; elemNum++) {
      elements[elemNum].setTop(topOfset * elemNum);
      elements[elemNum].setLeft(leftOfset * elemNum);
    }

    this.callSuper('initialize', elements);
    }
});

module.exports = Pile;
