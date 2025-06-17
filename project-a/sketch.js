/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let t = 0;
let frontForms = [],
  backForms = [];
let alphaFront = [],
  alphaBack = [];
let walker = { x: 400, y: 250, angle: 0, color: [0, 80] };
let trail = [];
let caught = false;

function setup() {
   let canvas = createCanvas(800, 500);
   canvas.parent("p5-canvas-container");
  // createCanvas(800, 500);
  angleMode(DEGREES);
  noFill();
  strokeWeight(1.5);
  stroke(0);
  generateForms();
  noCursor();
}

function draw() {
  background(255);
  drawBuildings(backForms, alphaBack, 0.82, -30);
  drawTrail();
  updateWalker();
  drawBuildings(frontForms, alphaFront, 1.18, 30);
  drawMouseAura();
  gotNerve();
}

function generateForms() {
  (frontForms = []), (backForms = []);
  (alphaFront = []), (alphaBack = []);
  for (let i = 0; i < 10; i++) {
    let b = makeBuilding(i);
    frontForms.push(b);
    alphaFront.push(255);
    let bb = makeBuilding(i);
    backForms.push(bb);
    alphaBack.push(255);
  }
}

function makeBuilding(i) {
  let ellipses = [];
  for (let j = 0; j < floor(random(1, 3)); j++) {
    ellipses.push({
      x: random(-25, 25),
      y: random(-70, 70),
      size: random(6, 26),
    });
  }
  let slices = [];
  for (let k = 0; k < floor(random(1, 4)); k++) {
    slices.push({ x: random(-25, 25) });
  }
  let lines = [];
  for (let m = 0; m < floor(random(1, 3)); m++) {
    lines.push({ x: random(-20, 20), y: random(-40, 40), w: random(20, 40) });
  }
  return {
    baseX: i * 100 + random(-5, 5),
    baseYOffset: random(-10, 10),
    w: random(50, 80),
    h: random(120, 200),
    arcScale: random(0.6, 1.2),
    arcAngle: random(60, 120),
    arcRotation: random(360),
    diagOffset: random(5, 20),
    ellipses,
    slices,
    lines,
  };
}

function drawBuildings(forms, alphas, scaleF, yOffset) {
  push();
  translate(width / 2 + 20, height / 2 + yOffset);
  scale(scaleF);
  translate(-width / 2, -height / 2);
  for (let i = 0; i < forms.length; i++) {
    let b = forms[i];
    let near =
      dist(mouseX, mouseY, b.baseX, 100 + b.baseYOffset) < 60 && caught;
    let baseY = 220 + noise(i * 0.2, t * 50) * 40 + b.baseYOffset;
    let h = near ? b.h : b.h + sin(t * 100 + i) * 12;
    let target = near ? 40 : 160;
    alphas[i] = lerp(alphas[i], target, 0.01);

    push();
    translate(b.baseX, baseY);
    stroke(0, alphas[i]);
    fill(255);
    rect(-b.w / 2, -h / 2, b.w, h);
    line(-b.w / 2, -h / 2 + b.diagOffset, b.w / 2, h / 2 - b.diagOffset);
    push();
    rotate(b.arcRotation);
    arc(0, 0, b.w * 1.2, h * b.arcScale, 0, b.arcAngle);
    pop();
    for (let e of b.ellipses) ellipse(e.x, e.y, e.size);
    for (let s of b.slices) line(s.x, -h / 2, s.x, h / 2);
    for (let l of b.lines) line(l.x - l.w / 2, l.y, l.x + l.w / 2, l.y);
    pop();
  }
  pop();
}

function updateWalker() {
  walker.angle += random(-20, 20);
  walker.x += cos(walker.angle) * 2;
  walker.y += sin(walker.angle) * 2;
  if (walker.x <= 0 || walker.x >= width) walker.angle = 180 - walker.angle;
  if (walker.y <= 150 || walker.y >= 400) walker.angle = -walker.angle;
  walker.x = constrain(walker.x, 0, width);
  walker.y = constrain(walker.y, 150, 400);
  trail.push({ x: walker.x, y: walker.y });
  if (trail.length > 50) trail.shift();
}

function drawTrail() {
  noFill();
  for (let i = 0; i < trail.length; i++) {
    let p = trail[i];
    let alpha = map(i, 0, trail.length, 10, 40);
    stroke(walker.color[0], walker.color[1], walker.color[2], alpha);
    ellipse(p.x, p.y, 2);
  }
}

function drawMouseAura() {
  push();
  translate(mouseX, mouseY);
  stroke(0);
  noFill();
  beginShape();
  for (let a = 0; a < 600; a += 6) {
    let r = 6 + a * 0.02;
    let x = cos(a) * r;
    let y = sin(a) * r;
    vertex(x, y);
  }
  endShape();
  pop();
}

function gotNerve() {
  let d = dist(mouseX, mouseY, walker.x, walker.y);
  if (d < 10 && mouseIsPressed) {
    caught = true;
    walker.color = random([
      [255, 0, 0],
      [0, 0, 255],
      [255, 255, 0],
    ]);
    generateForms();
  }
}
