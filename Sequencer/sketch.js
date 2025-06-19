let bassArray = [false, false, false, false, false, false];
let boxSize = 80;
let topMargin = 50;

let speed = 4;
let playheadX = -speed;

let bass;

function preload(){
  bass = loadSound("assets/brendanCan.mp3")
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
}

function draw() {
  background(220);

  drawBox(50, topMargin, boxSize, true);
  drawBox(200, topMargin, boxSize, false);

  for(let i = 0; i < bassArray.length; i++){
    let x = i*boxSize; 
    drawBox(x, topMargin, boxSize, bassArray[i]);
  }

  line(playheadX, 0, playheadX, height);

  playheadX+=speed;
  // set back to 0 at end of boxes
  if(playheadX >= bassArray.length * boxSize){
    playheadX = 0;
  }
  // check if we enter a new box:
  // we use % MODULO or REMAINDER
  if(playheadX%boxSize == 0){

    let boxIdx = playheadX/boxSize;
    console.log("readched box", boxIdx)

    let boxStatus = bassArray[boxIdx]
    console.log(boxStatus)
    if(boxStatus == true){
      bass.play()
    }
    
  }

}


function drawBox(x, y, size, checked){
  push();


  translate (x, y);

  stroke("red");
  strokeWeight(2);

  if (checked == true){
    fill(0)
  } else {
     fill(255)
  }

  rect(0, 0, size, size);


  pop();
}



function mousePressed(){

  // console.log(mouseX, mouseY);

  bass.play();


  if(mouseY > topMargin && mouseY < topMargin + boxSize && mouseX < bassArray.length*boxSize){
    //on the boxes
    // but which box are we on?
    let boxIdx = floor(mouseX / boxSize)
    //console.log(mouseX, boxIdx)
    // console.log(bassArray[boxIdx])
    if(bassArray[boxIdx] == true){
      bassArray[boxIdx] = false;
    }else{
      bassArray[boxIdx] = true;
    }
  }


}