let img;
let cam;
let cam_open = false;
let portraits = [];
let instruction;
let shutter;

// arduino
let port;
let connectBtn;
let str; //string from arduino
let val; // array with sensor values


function preload() {
  shutter = loadSound("assets/shutter.mp3");
  instruction = loadImage("assets/GoldenFace.png");
  slap = loadSound("assets/slap.mp3");
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("p5-canvas-container");
  // p = new Portrait();
  cam = createCapture(VIDEO, { flipped: true });
  cam.hide();

  //connecting arduino

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

}

function draw() {

  background(255);
  if (portraits.length == 0) {
    image(cam, 0, 0)
    push();
    scale(0.3);
    // imageMode(CENTER);
    image(instruction, width / 2 + instruction.width / 2, height / 2 + 70);
    // textMode(CENTER);
    pop();
    // fill(random[0, 255]);
    textSize(20);
    text('Place yourself in the Golden Ratio✨', width / 2 - 155, 60);
    noFill();
    stroke(255, 0, 0);
    //left eye reference
    rect(240, 200, 63, 50);
    //right eye reference
    rect(350, 200, 63, 50);
    // //forehead reference
    // rect(200, 40, 250, 150);

  }

  // loop over portraits array and display them
  for (let i = 0; i < portraits.length; i++) {
    portraits[i].display();
  }
  // textSize(10);
  // text(floor(mouseX) + "," + floor(mouseY), mouseX, mouseY);

  cursor('grab');


  // connecting arduino


  str = port.readUntil("\n");
  //str = trim(str); //remove any empty space

  if (str.length > 0 ) {
    val = int(str.split(",")); //split the values if there is a comma in between and convert them into numbers

    // you receive three values from arduino that are stored
    // in the array called val
    // the first value is a range, see it like this
    // fill(255)
    // text(val[0], 20, 20)
    // the second and third value are either 0 or 1 and will most likely
    // trigger your dancer's two special motions
      //take pic // button

    // //head
      //take pic // button
    if (val[0] == 1 ) {
     let newPortrait = new Portrait();
      shutter.play();
      portraits.push(newPortrait)
    }

    if(portraits.length >0){

    
      //left face
      if (val[1] == 1) {
      portraits[0].skewLeftFace();
      portraits[0].stretchLeftEye();
        slap.play();
      }

      //right face
      if (val[2] == 1) {
      portraits[0].skewRightFace();
      portraits[0].stretchRightEye();
        slap.play();
      }

      //head
      if (val[3] == 1) {
      portraits[0].squeezUpper();
        slap.play();
      }
    }

  }

}


class Portrait {
  constructor() {


    //load camera pixles
    cam.loadPixels()

    this.pixels = cam.pixels;

    this.img = createImage(640, 480);

    //Photoshop Function
    this.LfFactor = 0; // -40;
    this.LfSk = 0; // -2;

    this.RfFactor = 0; // -170;
    this.RfSk = 0; // -2;

    this.LeYFactor = 0; // 30;
    this.LeStr = 0; // 2;

    this.ReYFactor = 0; // 10;
    this.ReStr = 0; // 2;

    this.upperFactor = 0; // -40;
    this.upSqz = 0; // -2;

    //Define Size for each part
    this.lefthalfX = 0;
    this.lefthalfY = 0;//this.lefthalfY - this.upSqz;
    this.lefthalfW = 320;
    this.lefthalfH = 480;

    this.righthalfX = 320;
    this.righthalfY = 0;
    this.righthalfW = 320;
    this.righthalfH = 480;

    this.leftEyeFaceRatio = 0.75;
    this.lefteyeX = this.lefthalfX + this.lefthalfW * this.leftEyeFaceRatio;
    this.lefteyeY = 200
    this.lefteyeW = 63;
    this.lefteyeH = 50;

    this.rightEyeFaceRatio = 0.06;
    this.righteyeX = 350//this.righthalfX + this.righthalfW*0.02
    this.righteyeY = 200
    this.righteyeW = 63;
    this.righteyeH = 50;

    this.upperhalfW = 250;
    this.upperhalfH = 150;
    this.upperhalfX = 200;
    this.upperhalfY = 190 - this.upperhalfH// (320 - this.lefthalfY)*0.125;


    // this.lefthalf.copy(this.img, 0, 0, 320, 480, 0, 0, 320, 480);
    // this.righthalf.copy(this.img, 320, 0, 320, 480, 0, 0, 320, 480);
    // this.lefteye.copy(this.img, 240, 200, 63, 50, 0, 0, 63, 50);
    // this.righteye.copy(this.img, 350, 200, 63, 50, 0, 0, 63, 50);
    // this.upperhalf.copy(this.img, 200, 40, 250, 150, 0, 0, 250, 150);


    //Create Imagew
    this.lefthalf = createImage(320, 480);
    this.righthalf = createImage(320, 480);
    this.lefteye = createImage(63, 50);
    this.righteye = createImage(63, 50);
    this.upperhalf = createImage(250, 150);
    // this.leftleft = createImage(320, 480);
    // this.rightleft = createImage(320, 480);
    // this.upperleft = createImage(320, 480);




    // assign pixels to img:
    this.img.loadPixels();

    for (let y = 0; y < this.img.height; y++) {
      for (let x = 0; x < this.img.width; x++) {
        let index = (x + y * this.img.width) * 4;

        // console.log(x, y)
        // console.log(this.img.pixels, this.pixels)

        this.img.pixels[index + 0] = this.pixels[index + 0]; // R from the original pixel
        this.img.pixels[index + 1] = this.pixels[index + 1]; // G
        this.img.pixels[index + 2] = this.pixels[index + 2]; // B
        this.img.pixels[index + 3] = 255; // Alpha value mapped based on the distance from mouse position
      }
    }

    this.img.updatePixels();
    //copy(sx, sy, sw, sh, dx, dy, dw, dh)
    this.lefthalf.copy(this.img, 0, 0, 320, 480, 0, 0, 320, 480);
    this.righthalf.copy(this.img, 320, 0, 320, 480, 0, 0, 320, 480);
    this.lefteye.copy(this.img, 240, 200, 63, 50, 0, 0, 63, 50);
    this.righteye.copy(this.img, 350, 200, 63, 50, 0, 0, 63, 50);
    this.upperhalf.copy(this.img, 200, 40, 250, 150, 0, 0, 250, 150);
    //forehead reference
    //rect(200, 40, 250, 150);
    // //right eye reference
    // rect(350, 200, 63, 50);
    //this.lefteye
    //this.righteye
    //this.upperhlaf
    //this.leftleft
    //this.rightleft
    //this.upperleft

  }

  update() {



  }

  display() {
    // display the pixels (photo)
    // image(this.lefthalf, this.lefthalfX, this.lefthalfY, 320 + this.LfFactor, 480);
    // image(this.righthalf, 320, 0, 320 + this.RfFactor, 480);
    // image(this.lefteye, this.lefteyeX, 200-20, 63+7, 50 + this.LeYFactor);
    // image(this.righteye, this.righteyeX, 200, 63-13, 50 + this.ReYFactor);
    // image(this.upperhalf, 200 , this.upperhalfY, 180, 150 + this.upperFactor);

    image(this.lefthalf, this.lefthalfX, this.lefthalfY, this.lefthalfW, this.lefthalfH);
    image(this.righthalf, this.righthalfX, this.righthalfY, this.righthalfW, this.righthalfH);
    image(this.lefteye, this.lefteyeX, this.lefteyeY, this.lefteyeW, this.lefteyeH);
    image(this.righteye, this.righteyeX, this.righteyeY, this.righteyeW, this.righteyeH);
    image(this.upperhalf, this.upperhalfX, this.upperhalfY, this.upperhalfW, this.upperhalfH);

    // noFill();
    // stroke("red")
    // rect(this.lefthalfX, this.lefthalfY, this.lefthalfW, this.lefthalfH);
    // rect(this.righthalfX, this.righthalfY, this.righthalfW, this.righthalfH);
    // rect(this.lefteyeX, this.lefteyeY, this.lefteyeW, this.lefteyeH);
    // rect(this.righteyeX, this.righteyeY, this.righteyeW, this.righteyeH);
    // rect(this.upperhalfX, this.upperhalfY, this.upperhalfW, this.upperhalfH);

    //forehead reference
    //rect(200, 40, 250, 150);
  }

  skewLeftFace() {
    //LfIndex = -40
    // this.LfFactor = this.LfFactor + this.LfSk
    // this.lefthalfX = 0 - this.LfFactor;
    // this.lefteyeX = (320-this.lefthalfX) * 0.75+this.lefthalfX;
    // change left half
    this.lefthalfW -= 4
    this.lefthalfX += 4
    // adjust eye position
    this.lefteyeX = this.lefthalfX + this.lefthalfW * this.leftEyeFaceRatio;
    // addjust top
    this.upperhalfW -= 1;
    this.upperhalfX += 1
  }

  skewRightFace() {
    //RfIndex = -170
    // this.RfFactor = this.RfFactor + this.RfSk
    // this.righteyeX = 320 + (320 + this.RfFactor)*0.02;
    // change right half
    this.righthalfW -= 4
    // this.righthalfX += 4
    // adjust eye position
    this.righteyeX = this.righthalfX + this.righthalfW * this.rightEyeFaceRatio;
    // addjust top
    this.upperhalfW -= 2;
    this.upperhalfX += 1
  }

  stretchLeftEye() {
    // LeYIndex = 30
    this.LeYFactor = this.LeYFactor + this.LeStr
  }

  stretchRightEye() {
    // ReYIndex = 10
    this.ReYFactor = this.ReYFactor + this.ReStr
  }

  squeezUpper() {
    // this.upperFactor = this.upperFactor + this.upSqz;
    // this.upperhalfY = (320-this.lefthalfY)*0.125;
    this.upperhalfH -= 2;
    this.upperhalfY = 190 - this.upperhalfH// (320 - this.lefthalfY)*0.125;
  }




}


function keyPressed() {
  //   //take pic
  //   if (key === "c" || key === "C") {
  //     let newPortrait = new Portrait();
  //     shutter.play();
  //     portraits.push(newPortrait)
  //   }
  //save
  if (key === "s" || key === "S") {
    saveCanvas('myLovelySelfie👽', 'jpg');
  }
  //   //skew 
  //   if (key === "1"){
  //    portraits[0].skewLeftFace();
  //    slap.play();
  //     }
  //   if(key === "2") {
  //     portraits[0].skewRightFace();
  //     slap.play();
  //     }
  //   //strech
  //   if (key === "3"){
  //     portraits[0].stretchLeftEye();
  //     slap.play();
  //     }
  //   if (key === "4"){
  //     portraits[0].stretchRightEye();
  //     slap.play();
  //    }
  //   if (key === "5"){
  //     portraits[0].squeezUpper();
  //     slap.play();
  //   }
}


function connectBtnClick() {
  if (!port.opened()) {
    port.open("Arduino", 57600);
  } else {
    port.close();
  }
}



