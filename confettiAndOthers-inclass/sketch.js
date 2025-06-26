let confettis = [];
let t;
let walker;
let numConfettis = 50;
let mic;
let preLevel = 0;

let bite;

let timeOfLastBite = 0;

let apple;
let pear;

function preload(){
  bite = loadSound("assets/bite.mp3");
  apple = loadImage("assets/apple.png");
  pear = loadImage("assets/pear.png");
}

let backgroundHue = 0;

// i added a sound in the assets folder, if we have time we can add it

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  colorMode(HSB); // HUE SATURATION BRIGHTNESS
  backgroundHue = random(360);

  t = new Target(200, 200);
  walker = new Eater();

  canvas.mousePressed(userStartAudio);
  textAlign(CENTER);

  //initialize audio
  mic = new p5.AudioIn();
  mic.start();

}

function draw() {
  background(backgroundHue, 10, 190);

  // display the target
  t.update();
  t.display();
  t.checkIfEaten();


  // display the eater
  walker.update();
  walker.display();


  /*
    add confetti sometimes
      5%200   ==> 5
      200%200 ==> 0
      201%200 ==> 1
      205%200 ==> 5
      310%200 ==> 110
      400%200 ==> 0
  */
  // if(frameCount % 200 == 0){
  //   drawConfetti(600, 100);
  // }


  // display the confetti
  for(let i = 0; i < confettis.length; i++){
    confettis[i].update();
    confettis[i].display();
    confettis[i].checkOnScreen();
  }
  
  // delete confettis that are not on screen
  // for(let i = 0; i < confettis.length; i++){
  for(let i = confettis.length-1; i >= 0 ; i--){
    if(confettis[i].onScreen == false){
      // this confetti should go
      confettis.splice(i, 1);
    }
  }

  //mic
  fill(0);
  text('tap to start', width/2, 20);

  micLevel = mic.getLevel();
  if(micLevel > 0.15 && prevLevel <0.15 && millis() - timeOfLastBite > 200){
    // console.log(micLevel);
    walker.turnRight();
  }

  let y = height - micLevel * height;
  // ellipse(width/2, y, 10, 10);
  prevLevel = micLevel;

}//closing of draw function

function drawConfetti(x, y){
  for(let i = 0; i < numConfettis; i++){
    confettis.push( new Confetti(x, y) )
  }
}


class Confetti{
  constructor(startX, startY){
    this.x = startX;
    this.y = startY;
    this.size = random(2, 10);
    
    this.speedX = random(-2, 2);
    this.speedY = random(-1, -3);

    this.c = color(random(360), 255, 255)
    
    this.onScreen = true;
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

class Target{
  constructor(startX, startY){
    this.x = startX;
    this.y = startY;
    // this.active = true;
    this.dia = 40;

    this.type = "apple" || "pear";

  }
  update(){
    // optional: make the target move?
    // or make it move sporadically? 

  }
  display(){
    push();
    translate(this.x, this.y);

    if (this.type == "apple"){
      push();
      scale(0.1);
      let halfImageWidth = apple.width/2;
      let halfImageHeight = apple.height/2;
      image(apple, -halfImageWidth, -halfImageHeight);
      pop();
    }

    if (this.type == "pear"){
      push();
      scale(0.08);
      let halfImageWidth = pear.width/2;
      let halfImageHeight = pear.height/2;
      image(pear, -halfImageWidth, -halfImageHeight-50);
      pop();
    }

    noFill();
    noStroke();
    circle(0, 0, this.dia);

    pop();
  }
  checkIfEaten(){
    // get the distance between eater and the target
    
    //mouseEast //let d = dist(mouseX, mouseY, this.x, this.y);
    //
    let d = dist(walker.x, walker.y, this.x, this.y);

    console.log(d);

    // using the distance, find out if the target was found
    // let eatDistance = 5; //mouseEast

    let eatDistance = this.dia/2 + walker.dia/2;
    if (d < eatDistance){
      console.log("EATEN!!!!!!!");

      drawConfetti(this.x, this.y);

      bite.play();
      timeOfLastBite = millis();

      this.x = random(width);
      this.y = random(height);
      this.type = random(["apple", "pear"])

    }


        // if it was found... change its location? 

  }

}


class Eater{
  constructor(){
    this.x = random(width);
    this.y = random(height);
    this.speed = 5;
    this.dia = 50;

    this.c = (backgroundHue+180)%360; // get polar opposite hue of background hue

    this.direction = "LEFT"; // RIGHT, DOWN, LEFT, UP
    
  }
  update(){
    if(this.direction == "RIGHT"){
      this.x += this.speed;
      if(this.x > width){
        this.x = 0
      }
    }else if(this.direction == "DOWN"){
      this.y += this.speed;
      if(this.y > height){
        this.y = 0
      }
    }else if(this.direction == "LEFT"){
      this.x -= this.speed;
      if(this.x < 0){
        this.x = width
      }
    }else if(this.direction == "UP"){
      this.y -= this.speed;
      if(this.y < 0){
        this.y = height
      }
    }
  }
  turnRight(){
    
    if(this.direction == "RIGHT"){
      this.direction = "DOWN";
    }else if(this.direction == "DOWN"){
       this.direction = "LEFT";

    }else if(this.direction == "LEFT"){

       this.direction = "UP";
     
    }else if(this.direction == "UP"){
     
       this.direction = "RIGHT";

    }
  }
  display(){
    push();
    translate(this.x, this.y);

    noStroke();
    fill(this.c, 255, 255)
    circle(0, 0, this.dia)
    pop();
  }

}

function mousePressed(){
  // drawConfetti(mouseX, mouseY);
  // walker.turnRight();
  // t.checkIfEaten(); 
}