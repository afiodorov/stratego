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

    var tileGroups =[];

    //The game will be played top to bottom. "rows" are horizontal, and columns are verticle.
    for (var row = 1; row <= tiles.NUM_OF_ROWS; row++) {
        var numCols = tiles.columnLimit(row);
        for (var col = 1; col <= numCols ; col++) {
            var rectWidth = BOARD_WIDTH / numCols;
            var rectHeight = BOARD_HEIGHT / tiles.NUM_OF_ROWS;
            var rectX = rectWidth * (col - 1);
            var rectY = rectHeight * (row - 1);
            tileGroups.push(new Kinetic.Group({
                width: rectWidth,
                height: rectHeight,
                x: rectX,//1 indexing ftw
                y: rectY
            }).add(                
                new Kinetic.Rect({
                width: rectWidth,
                height: rectHeight,
                fill: 'green',
                stroke: 'black',
                strokeWidth: 4
            })).add(new Kinetic.Text({
                width: rectWidth,
                height: rectHeight,
                text: tiles[[row, col]].name,
                fontSize: 18,
                fontFamily: 'Calibri',
                fill: '#555',
                padding: 20,
                align: 'center'
            })));
        }
    }
    layer.add(hex);
    tileGroups.forEach(function (tile) { layer.add(tile); })
    stage.add(layer);
}

draw();

