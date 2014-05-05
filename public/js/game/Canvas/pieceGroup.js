var Kinetic = require('../../../vendor/kinetic-v5.0.1.min.js');

function getPieceGroup(piece, xOffset) {
  var radius = 35;
  var group = new Kinetic.Group({
    x: xOffset,
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
  return group;
}

module.exports = getPieceGroup;