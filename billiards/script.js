const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth -30;
canvas.height = window.innerHeight - 110;


//set up widths
const simMinWidth=2.0;
const cScale=Math.min(canvas.width, canvas.height) / simMinWidth;
simWidth= canvas.width / cScale;
simHeight= canvas.height / cScale;


function cX(pos){
    return pos.x* cScale
}

function cY(pos){
    return canvas.height - pos.y * cScale; 
}


function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';


}

function simulate(){
    
}


function update(){
    simulate();
    draw();
    requestAnimationFrame(update);
}

update();