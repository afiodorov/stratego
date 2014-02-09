/// <reference path="../structs/tiles.js" />
/// <reference path="../../../vendor/kinetic-v5.0.1.min.js" />
var Kinetic = require('../../../vendor/kinetic-v5.0.1.min.js');

var BOARD_WIDTH = 600;
var BOARD_HEIGHT = 600;

// Animation.....................................................
function draw() {
    var stage = new Kinetic.Stage({ container: "canvasPlayground", width: BOARD_WIDTH, height: BOARD_HEIGHT });
    var layer = new Kinetic.Layer();
    var hex = new Kinetic.RegularPolygon({
        x: 100,
        y: stage.height() / 2,
        sides: 6,
        radius: 70,
        fill: '#00D2FF',
        stroke: 'black',
        strokeWidth: 4,
        draggable: true
    });

    var tiles = require("../structs/tiles.js");

    var tileRects = new Array();

    //The game will be played top to bottom. "rows" are horizontal, and columns are verticle.
    for (var row = 1; row <= tiles.NUM_OF_ROWS; row++) {
        var numCols = tiles.columnLimit(row);
        for (var col = 1; col <= numCols ; col++) {
            var tileWidth = BOARD_WIDTH / numCols;
            var tileHeight = BOARD_HEIGHT / tiles.NUM_OF_ROWS;
            //tileRects.push(new Kinetic.Rect({
            //    width: tileWidth,
            //    heigth: tileHeight,
            //    x: tileWidth * (col - 1),//1 indexing ftw
            //    y: tileHeight * (row -1),
            //    fill: '#00D2FF'
            //}));
            tileRects.push(new Kinetic.Rect({
                width: tileWidth,
                height: tileHeight,
                x: tileWidth * (col - 1),//1 indexing ftw
                y: tileHeight * (row - 1),
                fill: 'green',
                stroke: 'black',
                strokeWidth: 4
            }));


        }
    }
    layer.add(hex);
    tileRects.forEach(function (tile) { layer.add(tile); })
    stage.add(layer);
}

draw();

