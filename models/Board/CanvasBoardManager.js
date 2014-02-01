var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');


// Animation.....................................................

function animate(time) {
    context.clearRect(0,0,canvas.width,canvas.height);
    //update();
    var board = getBoard(canvas);
    board.draw(context);

    //context.fillStyle = 'cornflowerblue';
    //context.fillText(calculateFps().toFixed() + ' fps', 45, 50);

    window.requestNextAnimationFrame(animate);
}
   
// Initialization................................................

context.font = '48px Helvetica';

animateButton.onclick = function (e) {
   //paused = paused ? false : true;
   //if (paused) {
   //   animateButton.value = 'Animate';
   //}
   //else {
   //  window.requestNextAnimationFrame(animate);
   //   animateButton.value = 'Pause';
   //}
};