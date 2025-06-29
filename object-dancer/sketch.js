/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/


let dancer;

let NUM_OF_PARTICLES = 50; // Decide the initial number of particles.
let particles = [];

// arduino
let port;
let connectBtn;
let str; //string from arduino
let val; // array with sensor values

// ⬆️ add these ⬆️


function preload(){
  ufo = loadSound("assets/ufo.mp3");
  quack = loadSound("assets/quack.mp3");
  explosion = loadSound("assets/explosion.mp3")
}


function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new SawinDancer(width / 2, height / 2);
  colorMode(HSB);

   // ⬇️ add these lines ⬇️

  port = createSerial();

  // in setup, we can open ports we have used previously
  // without user interaction
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 57600);
  }

  // any other ports can be opened via a dialog after
  // user interaction (see connectBtnClick below)
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(20, 370);
  connectBtn.mousePressed(connectBtnClick);

  // ⬆️ add these lines ⬆️

}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  // update and display
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.update();
    p.display();
    if (this.visible == false){
     particles.splice(i, 1);
    }


    
  }


  dancer.update();
  dancer.display();


 // ⬇️ add these lines nd adjust the details ⬇️


  str = port.readUntil("\n");
  //str = trim(str); //remove any empty space

  if (str.length > 0) {
    val = int(str.split(",")); //split the values if there is a comma in between and convert them into numbers

    // you receive three values from arduino that are stored
    // in the array called val
    // the first value is a range, see it like this
    push();
    fill(255)
    text(val[2], 20, 20)
    pop();
    // the second and third value are either 0 or 1 and will most likely
    // trigger your dancer's two special motions
  
    if (val[2] > 80) {
      // trigger your particles, you will have to adjust the threshold in the if statements
         // generate particles
        let x = random(width*0.3, width*0.7)
        let y = random(height*0.3, height*0.7)
        for (let i = 0; i < NUM_OF_PARTICLES; i++) {
          particles.push( new Particle(x, y) );
        }
        explosion.play();
    }
    if (val[1] == 0) {
      dancer.triggerA() 
    }
    if (val[0] == 0) {
      dancer.triggerD()
    }
  }

}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class SawinDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    // add properties for your dancer here:
    this.xOffset = 0;
    this.yOffset = 0;
    //..
    //..
    //..
    this.legX = -20;
    // this.armMoving = false;
    this.legAlpha1 = 55;
    this.legAlpha2 = 255;
    this.legScale1 = 1;
    this.legScale2 = 1;
    this.timeOfLastKeyPress
    this.animal = "🐄";
    this.animalList = ["🐄", "🐖", "🐁", "🐑", "🐓", "🐐", "🦔","🦆","🐥","🦖","🦕","🦙","🦬","🐇","🐿"];
    this.transmitting = false;
    this.animalY = 200;
    this.animalAlpha = 255;
    this.animalSize = 60;
    this.animalX = width+50;
    this.animalXGoal = 0;
  }
  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviour
    this.xOffset = sin(frameCount*.05)*30;
    this.yOffset = sin(frameCount*.1)*40;
    this.legX1 = map(sin(frameCount*0.12), -1, 1, -20, 20);
    this.legX2 = map(sin(frameCount*0.12+PI), -1, 1, -20, 20);
    this.legAlpha1 = map(cos(frameCount*0.12), -1, 1, 20, 100);
    this.legAlpha2 = map(cos(frameCount*0.12+PI), -1, 1, 20, 100);
    this.legScale1 = map(cos(frameCount*0.12), -1, 1, 0.8, 1.1);
    this.legScale2 = map(cos(frameCount*0.12+PI), -1, 1, 0.8, 1.1);


    this.animalX = lerp(this.animalX, this.animalXGoal, 0.3)
    // //arm
    // push();
    // translate();
    // //rotate(angles)
    // fill("red");
    // circle()
    // pop();


    //animal transmitting
    if(this.transmitting){
      if(this.animalY > 40){
        this.animalY -= 5;
        constrain(this.animalSize, 20, 60);
        constrain(this.animalAlpha, 0, 255);
        this.animalSize -= 1.2;
        this.animalAlpha -= -50;
      // }else if(this.animalY < 37){
      //   this.animalY += 3;
      //   this.animalSize += 0.8;
      }
    }

  // // update and display
  // for (let i = 0; i < particles.length; i++) {
  //   let p = particles[i];
  //   p.update();
  //   p.display();
  // }


  }

  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.

    push();
    translate(this.x+this.xOffset, this.y+this.yOffset);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️
    noStroke();
    //ufo body
    fill(0, 0, 60);
    arc(0, 30, 60, 60, radians(-180), radians(0), CHORD);
    //ufo hole
    fill(0, 0, 30);
    ellipse(0, 30, 60, 15);
    //alien head
    fill(86, 100, 95);
    ellipse(0, -20, 80+this.xOffset*0.2, 70+this.yOffset*0.2);
    //alien eyes
    fill(0);
    ellipse(-18, -20, 20, 10);
    ellipse(18, -20, 20, 10);
    // //alien mouth
    // fill("red");
    // ellipse(0, -3, 10, 5);
    // //alien arm
    // fill(114, 255, 63);
    // rect(-45, 5, 30, 5);
    // rect(15, 5, 30, 5);


    //alien leg1
    push();
      translate(this.legX1, 25)
     scale(this.legScale1);
    fill(60, 100, this.legAlpha1);
   
    rect(-5, 0, 10, 30);
    pop();
    
    //Animals
    push();
    translate(0, 0);
    textSize(this.animalSize);
    fill(255, this.animalAlpha);
    textAlign(CENTER)
    text(this.animal, this.animalX, this.animalY);
    pop();


    // alien leg2
    push();
    translate(this.legX2, 25)
     scale(this.legScale2);
    fill(60, 100, this.legAlpha2);
   
    rect(-5, 0, 10, 30);
    pop();
    

    // //cow
    // push();
    // scale(cowScale);
    // fill(alphaCow);
    // text("🐄",-5, this.cowY);
    // pop();

    // fill(255);
    // text(mouseX + "," + mouseY, mouseX, mouseY);


    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    // this.drawReferenceShapes()

    // pop();
  }
  
  triggerA(){
    this.transmitting = true;   
    ufo.play();
  }

  triggerD(){
    this.animal = random(this.animalList);
    this.animalY = 200;
    this.animalX = width+50;
    // if (animalX >-30){
    //   this.animalX -= 5;
    // }
    this.animalAlpha = 255;
    this.animalSize = 60;
    quack.play();
    this.transmitting = false;

  }

  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }

}




/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/

/*
Here are the key events that your dancer should react to in some way.
*/

// function keyPressed(){
//   if(key == "a"){
//     dancer.triggerA()
//   }else if(key == "d"){
//     dancer.triggerD()
//   }else if(key == "p"){
//     // generate particles
//   let x = random(width*0.3, width*0.7)
//   let y = random(height*0.3, height*0.7)
//   for (let i = 0; i < NUM_OF_PARTICLES; i++) {
//     particles[i] = new Particle(x, y);
//   }
//   explosion.play();
//   }
// }


class Particle {
  // constructor function
  constructor(startX, startY) {
    // properties (variables): particle's characteristics
    this.x = startX;
    this.y = startY;
    this.dia = 40;
    this.speedX = random(-2, 2);
    this.speedY = random(-1, -2);  
    this.planetFill = 360;//random(360);
    this.planetB = 0;
    this.visible = true;
  }
  // methods (functions): particle's behaviors
  update() {
    // (add) 
    if (this.planetFill > 5){
      this.planetFill-=random(5);
      // this.planetB += 1;
    }else if (this.planetFill < 5){
      this.x+=this.speedX;
      this.speedX *= 0.99;

      this.y+=this.speedY;
      this.speedY *= 0.99 ;

      this.dia *= 0.99;

      // this.planetB -=1;
    }

  if (this.dia <0.0001){
    this.visible = false;
  }

  // if (this.visible == false){
  //   particles.splice(i, 1);
  // }



  }
  display() {
    // particle's appearance
    push();
    translate(this.x, this.y);
    
    fill(this.planetFill, 100, 100);
    circle(0, 0, this.dia);

    pop();
  }

 

}



function connectBtnClick() {
  if (!port.opened()) {
    port.open("Arduino", 57600);
  } else {
    port.close();
  }
}
