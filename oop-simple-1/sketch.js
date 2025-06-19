let dino;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  dino = new Dinosaur(100, 300);
  dino2 = new Dinosaur(300, 200);
}

function draw() {
  background(220);

  dino.update();
  dino.display();

  dino2.display();

}


// class definition / blueprint
class Dinosaur{
  constructor(starX, starY){
    this.x = startX;
    this.y = starY;
    this.type = random(["trex", "flying"]);
    this.col = color(255, random(255), 120);
    this.age = 0;
  }
  update(){
    this.age += 0.1;
    this.x += 1;
  }
  display(){
    push();
    translate(this.x, this.y);

    fill(this.col);
    if(this.type == "trex"){
    rect(-30, -30, 60, 60);
    fill(0);
    text("trex", 0, 0);
    }else if(this.type == "flying"){
     ellipse(0, 0, 60, 40);
     fill(0);
     text("flying", 0, 0);
    }
  
    fill("red");
    circle(0, 0, 5);

    pop();
  }

}