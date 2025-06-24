let confettis = [];
let numConfettis = 1;

let backgroundHue = 200;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  // for(let i = 0; i < numConfettis; i++){
  //   confettis.push( new Confetti(width/2, height/2) )
  // }

  colorMode(HSB); //Hue Saturation Brightness
}



function draw() {

  // confettis.push( new Confetti(width/2, height/2) )
  background(backgroundHue, 10, 120);
  if(mouseIsPressed == true){
    for(let i = 0; i < numConfettis; i++){
    confettis.push( new Confetti(mouseX, mouseY) )
  }
  }

  for(let i = 0; i < confettis.length; i++){
    confettis[i].update();
    confettis[i].display();
    confettis[i].checkOnScreen();
  }

  fill(255);
  text(confettis.length, 20, 20);
  
  //delete oldest confetti when reaching a threshold

  // while(confettis.length > 1000){
  // confettis.splice(0,1);
  // }

  //deleteconfettis that are not on screen
  for(let i = 0; i < confettis.length; i++){
    if(confettis[i].onScreen == false){
      //this confetti should go
      confettis.splice(i, 1);
    }
  }

}

class Confetti{
  constructor(startX, startY){
    this.x = startX;
    this.y = startY;
    this.size = random(2, 10);
    
    this.speedX = random(-2, 2);
    this.speedY = random(-1, -3);   

    this.onScreen = true;

    this.c = color(random(360), 255, 255)

  }
  update(){
    this.x+=this.speedX;
    this.speedX *= 0.99;

    this.y+=this.speedY;
    this.speedY += 0.1;
  }
  display(){    
    push();
    translate(this.x, this.y);

      fill(this.c);
      noStroke();
      circle(0, 0, this.size);
   
    pop();
  }

  checkOnScreen(){
    if(this.y > height){
      this.onScreen = false;
    }
  }

}

// function mousePressed(){
//   for(let i = 0; i < numConfettis; i++){
//     confettis.push( new Confetti(mouseX, mouseY) )
//   }
// }
