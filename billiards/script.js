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

//define a vector class
class Vector2{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    add(v,s=1.0){
        this.x+= v.x * s;
        this.y+= v.y * s;
        return this;
    }
    addVectors(a,b){
        this.x= a.x + b.x;
        this.y= a.y + b.y;
        return this;
    }

    subtract(v,s=1.0){
        this.x-=v.x*s;
        this.y-=v.y*s;
        return this;
    }
    subtractVectors(a,b){
        this.x= a.x - b.x;
        this.y= a.y - b.y;
        return this;
    }
    clone(){
        return new Vector2(this.x, this.y);
    }
    scale(s){
        this.x *= s;
        this.y *= s;
        return this;
    }
    dot(v){
        return this.x * v.x + this.y * v.y;
    }
    length(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set(v){
        this.x = v.x;
        this.y = v.y;
        return this;
    }
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