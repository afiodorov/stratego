var tiles = requires("./utils/gameStructs").Tiles;

function getSquares(canvas){
    return {
        mordor: {
            name: "Mordor",
            position: {
                x: 0,
                y: 0,
                w: canvas.clientWidth / 2,
                h: canvas.clientHeight
            }
        },
        shire: {
            name: "The Shire",
            position: {
                x: canvas.clientWidth / 2,
                y: 0,
                w: canvas.clientWidth / 2,
                h: canvas.clientHeight
            }
        }
    };
}
function bacon()
{
    }



function drawSquare(context, square){
    context.strokeRect(square.position.x, square.position.y, square.position.w, square.position.h);
    context.textBaseline = 'top';  
    context.font         = '20px Sans-Serif';
    context.fillStyle    = 'blue';
    context.fillText  (square.name, 30, 50);
}