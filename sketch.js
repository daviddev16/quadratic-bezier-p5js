
const circleSize = 10;
const curveColor = "SkyBlue";
const defaultColor = "SteelBlue";

/* options */
let debugCheckbox;
let timeSlider;

let points = [];
let debugMode = false;
let draggingPoint;

function setup() {

  points.push(new Point(50, 200, circleSize)); /* origin */ 
  points.push(new Point(200, 150, circleSize)); /* anchor */
  points.push(new Point(350, 200, circleSize)); /* end */

  timeSlider = createSlider(0, 1, 0.5, 0.01);
  debugCheckbox = createCheckbox("Debug", false);
  debugCheckbox.changed(() => debugMode = debugCheckbox.checked());

  createCanvas(400, 400);
}

function draw() {
  background(0);

  if(debugMode) {
    debugSection(timeSlider.value());
  }

  drawBezier(timeSlider.value());

  noStroke();
  fill(defaultColor);

  for(let i = 0; i < points.length; i++){
    circle(points[i].x, points[i].y, points[i].radius);
  }
}

function drawBezier(time){
  noFill();
  stroke(curveColor);
  strokeWeight(3);
  beginShape();
  for(let t = 0; t <= time; t += 0.01){
    let x = (1-t) * ((1-t)*points[0].x + t*points[1].x) + t*((1-t)*points[1].x + t*points[2].x);
    let y = (1-t) * ((1-t)*points[0].y + t*points[1].y) + t*((1-t)*points[1].y + t*points[2].y);
    vertex(x, y);
  }
  endShape();
}

function debugSection(time){

  stroke(defaultColor);
  strokeWeight(2);
  line(points[0].x, points[0].y, points[1].x, points[1].y);
  line(points[1].x, points[1].y, points[2].x, points[2].y);

  line(lerp(points[0].x, points[1].x, time), lerp(points[0].y, points[1].y, time),
          lerp(points[1].x, points[2].x, time), lerp(points[1].y, points[2].y, time));

  noStroke();

  fill(defaultColor);
  circle(lerp(points[0].x, points[1].x, time),lerp(points[0].y, points[1].y, time), circleSize/2);
  circle(lerp(points[1].x, points[2].x, time),lerp(points[1].y, points[2].y, time), circleSize/2);

  fill(curveColor);
  circle((1-time) * ((1-time)*points[0].x + time*points[1].x) + time*((1-time)*points[1].x + time*points[2].x),
         (1-time) * ((1-time)*points[0].y + time*points[1].y) + time*((1-time)*points[1].y + time*points[2].y), circleSize/1.5);
}

function mouseDragged(){
  if(draggingPoint != null){
    draggingPoint.x = mouseX;
    draggingPoint.y = mouseY;
    return;
  }
  for(let i = 0; i < points.length; i++){
    if(points[i].isOver(mouseX, mouseY)){
      draggingPoint = points[i];
      break;
    }
  }
}

function mouseReleased(){
  draggingPoint = null;
}

class Point {
  constructor(x, y, radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  isOver(mouseX, mouseY){
    return (dist(this.x, this.y, mouseX, mouseY) <= this.radius);
  }

}