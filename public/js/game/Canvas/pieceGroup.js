var Kinetic = require('../../../vendor/kinetic-v5.0.1.min.js');

//expects piece.name to be undefined if it's on the enemy team.
var pieceGroup = function(piece) {
    new Kinetic.Circle({
        radius: rectHeight / 4,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4
    }).add(
    new Kinetic.Text({
        width: rectHeight,
        height: rectHeight,
        text: tiles[[row, col]].name,
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: '#555',
        padding: 20,
        align: 'center'
    }))
}

function getPieceGroup(piece) {
    //At most 6 pieces in 1 row, and 7 in a column
    var radius = Math.min(boardWidth / 12, boardHeight / 14);
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
//gameState.dark.pieces = [{position: [2,2]}, ... ];
//gameState.light.pieces = [{name: "gandalf", position: [2,2]}, ... ];
