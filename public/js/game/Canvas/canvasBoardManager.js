'use strict';
/*jslint node: true*/
/*global window*/

var GameManager = require('./../GameManager.js');
var side = require('./../structs/side.js');
var stage = require('./../structs/stage.js');
var Progress = require('./../progress.js');

function draw(container) {
  var gameManager = new GameManager();
  gameManager.setCanvasId(container);
  var progressJson = {
    side: side.LIGHT,
    stage: stage.piecesPlacement
  };
  gameManager.setProgress(new Progress(progressJson));
  gameManager.registerRules(gameManager.progress);
  gameManager.initaliseGui();
}

/**
 */
window.draw = draw;
