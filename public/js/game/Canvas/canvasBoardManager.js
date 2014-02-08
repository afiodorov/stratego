var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var BOARD_WIDTH = 600;
var BOARD_HEIGHT = 600;

// Animation.....................................................
function draw(){
	var stage = new Kinetic.Stage({container: "LotrStrategoCanvas", width: BOARD_WIDTH, height: BOARD_HEIGHT});
	var layer = new Kinetic.Layer();
	var hex = new Kinetic.RegularPolygon({
		x: 100,
		y: stage.height()/2,
		sides: 6,
		radius: 70,
		fill: '#00D2FF',
		stroke: 'black',
		strokeWidth: 4,
		draggable: true
	  });

	var tiles = require("./utils/gameStructs").tiles;//Will need to be made to work.
	var _ = require('../lib/underscore.js');

	var tileRects = new Array();
	
	var numTileColumns = tiles.length
	for(var w = 0; w < numTileColumns; w++){
		var numTileRows = tiles[w].length;
		for(var h=0; h < numTileRows; h++){
				tileRects[w*numTileColumns + h] = new Kinetic.Rect
			}
			}







	  layer.add(hex);
	  stage.add(layer);
	//context.clearRect(0,0,canvas.width,canvas.height);
	//update();
	//var board = getBoard(canvas);
	//board.draw(context);

	//context.fillStyle = 'cornflowerblue';
	//context.fillText(calculateFps().toFixed() + ' fps', 45, 50);
}

draw();

