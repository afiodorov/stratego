
var tileLayer = function (boardWidth, boardHeight) {
    var MAXPIECESINROW = 6;
    var MAXPIECESINCOL = 7;

    var Kinetic = require('../../../vendor/kinetic-v5.0.1.min.js');
    var tiles = require("../structs/tiles.js");
    var tileGroups = [];

    function getTileGroup(rectWidth, rectHeight, rectX, rectY) {
        var group = new Kinetic.Group({
            width: rectWidth,
            height: rectHeight,
            x: rectX,
            y: rectY
        });
        group.add(new Kinetic.Rect({
            width: rectWidth,
            height: rectHeight,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 4
        }));
        group.add(new Kinetic.Text({
            width: rectWidth,
            height: rectHeight,
            text: tiles[[row, col]].name,
            fontSize: 18,
            fontFamily: 'Calibri',
            fill: '#555',
            padding: 20,
            align: 'center'
        }));
        return group;
    }

    function getPieceGroup(piece) {
        var radius = Math.min(boardWidth / (MAXPIECESINROW * 2) , boardHeight / (MAXPIECESINCOL * 2));
        var group = new Kinetic.Group({
            width: radius * 2,
            height: radius * 2,
        });
        group.add(new Kinetic.Circle({
            radius: radius,
            x: radius,
            y: radius,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 4
        }));
        group.add(new Kinetic.Text({
            width: radius * 2,
            height: radius * 2,
            text: piece.name,
            fontSize: 18,
            fontFamily: 'Calibri',
            fill: '#555',
            padding: 20,
            align: 'center'
        }));
    }
    
    //The game will be played top to bottom. "rows" are horizontal, and columns are verticle.
    for (var row = 1; row <= tiles.NUM_OF_ROWS; row++) {
        var numCols = tiles.columnLimit(row);
        for (var col = 1; col <= numCols ; col++) {
            var rectWidth = boardWidth / numCols;
            var rectHeight = boardHeight / tiles.NUM_OF_ROWS;
            var rectX = rectWidth * (col - 1);
            var rectY = rectHeight * (row - 1);
            tileGroups.push(
                getTileGroup(rectWidth, rectHeight, rectX, rectY).add(
                new Kinetic.Circle({
                    radius: rectHeight / 4,
                    fill: 'red',
                    stroke: 'black',
                    strokeWidth: 4
                })).add(
                new Kinetic.Text({
                    width: rectHeight,
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
    var layer = new Kinetic.Layer();
    tileGroups.forEach(function (tile) { layer.add(tile); })
    return layer;
}

module.exports = tileLayer;