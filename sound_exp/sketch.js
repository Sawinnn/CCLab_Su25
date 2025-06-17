let xArray = [];
let yArray = [];
let diaArray =[];
let initalSizeOfArray = 20; // i can use any number here
let bap;

function preload(){
  bap = loadSound("sounds/gong-hit.wav")
}

function setup() {
  createCanvas(800, 500);
  
  
  for(let i = 0; i < initalSizeOfArray; i++){

    xArray[i] = random(0, width);
    yArray[i] = random(0, height);
    diaArray[i] = random(10, 20);

  }
  
}

function draw() {
  background(220);

  // xArray[1] += 1;

  for(let i = 0; i < xArray.length; i++){
    let x = xArray[i];
    let y = yArray[i];

    xArray [i] += random(-1,1)
    yArray [i] += random (-1,1)

    circle(x, y, diaArray[i]);
  }
  
}

function mousePressed(){
  bap.play()
  xArray.push(mouseX);
  yArray.push(mouseY)
  diaArray.push(random(10,50))
}