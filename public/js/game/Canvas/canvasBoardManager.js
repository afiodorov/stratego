'use strict';
/*jslint node: true*/
/*global window*/

var GameManager = require('./../GameManager.js');

function draw(container) {
  var gameManager = new GameManager();
  gameManager.setCanvasId(container);
  gameManager.initaliseGui();
}

/**
 */
window.draw = draw;
