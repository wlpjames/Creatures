

function startGame() {
    simulation.start();
    pack = 16;
    testCreature = [pack];
    for (var i = 0; i < pack; i++) {
      testCreature[i] = new creature(12, 12, "blue", 100 + (i*15), 100 + (i*20), i);
    }
}

var simulation = {
    canvas : document.getElementById("canvas"),
    start : function() {
        //sets game size acording to screen size
        var size = window.innerHeight / 1.5;
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style.width = size + "px";
        this.canvas.style.height = size + "px";
        this.context = this.canvas.getContext("2d");
        
        this.interval = setInterval(updateGameArea, 30);
    },
    clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function updateGameArea() {
  simulation.clear();
  for (var i = 0; i < pack; i+=4) {
    testCreature[i].intArr=testCreature[i].antenaIntersect();
    testCreature[i].forwards();
    testCreature[i].rotateC();
    testCreature[i].newPos();
    testCreature[i].update();

    testCreature[i+1].intArr=testCreature[i+1].antenaIntersect();
    testCreature[i+1].forwards();
    testCreature[i+1].rotateAC();
    testCreature[i+1].newPos();
    testCreature[i+1].update();

    testCreature[i+2].intArr=testCreature[i+2].antenaIntersect();
    testCreature[i+2].backwards();
    testCreature[i+2].rotateAC();
    testCreature[i+2].newPos();
    testCreature[i+2].update();

    testCreature[i+3].intArr=testCreature[i+3].antenaIntersect();
    testCreature[i+3].backwards();
    testCreature[i+3].rotateC();
    testCreature[i+3].newPos();
    testCreature[i+3].update();
  }
}



function creature(width, height, color, x, y, id) {

  this.width = width;
  this.height = height;
  this.speed = 1;
  this.angle = 0;
  this.moveAngle = 0;
  this.x = x;
  this.y = y; 
  this.ID =  id;
  

  const anteniNum = 11;
  var anteni = new Array();
  for (var i = 0; i < anteniNum; i++) {
    anteni.push(new antena(i, 50, anteniNum, 0.2));
  }

  intArr = [anteniNum];

  this.update = function() {
      ctx = simulation.context;
      ctx.fillStyle = color;
      
      ctx.beginPath();
      ctx.arc(this.x,this.y,8,0,2*Math.PI);
      ctx.strokeStyle = "Black";
      ctx.stroke();     
      this.drawAntena();
  }

  this.forwards = function() {
    //moves a step in direction
    this.speed = 1; 
  }

  this.backwards = function() {
    this.speed = -1; 
  }

  this.still = function() {
    this.speed = 0; 
  }
    
  this.rotateC = function() {
    this.moveAngle = 3;
  }
    
  this.rotateAC = function() {
    this.moveAngle = -3;
  }

  this.noRotate = function() {
    this.moveAngle = 0;
  }

  this.newPos = function() {

    this.angle += this.moveAngle * Math.PI / 180;
    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);
  }   

    

  this.drawAntena = function() {
      
    for (var i = 0; i < anteniNum; i++) { 
        
      anteni[i].drawnLen = intArr[i];
      var thing = simulation.context;
      thing.beginPath();
      thing.moveTo(this.x,this.y);
      thing.lineTo(anteni[i].endX(this.x, this.angle, true), anteni[i].endY(this.y, this.angle, true));
      if (intArr[i] < 50) {
        thing.strokeStyle = "#AA0000";
      }
      else {
        thing.strokeStyle = "#000000";
      }

      thing.stroke();

    }
  }

  this.antenaIntersect = function() {

    for (var i = 0; i < anteniNum; i++) {
      
      intArr[i] = 50; 
      
      for (var j = 0; j < pack; j++) {
        var curr = 50;
        //if antena[i] intersects creature[j] intersectArr = true;
        if (j != this.ID) {
          curr = anteni[i].intersects(testCreature[j], this.x, this.y, this.angle);
          if (curr < intArr[i]) {
            intArr[i] = curr;
          }
        }

      }

    }
    //returns array of values
    //return intersectArr;
  }
}    

function antena(num, length, anteniNum, space){
      this.ID = num;
      this.L = length;
      this.drawnLen = length;
      this.spaces = (anteniNum - 1) / 2;
      this.gap = space;


  this.endX = function(x, angle, type) {
    var length = this.L;
    if (type == true) { length = this.drawnLen;}

    var anteniAngle = angle - (this.gap * this.spaces) + (this.ID*this.gap);
    var endX = x + (length * Math.sin(anteniAngle));
    return endX;
  }

  this.endY = function(y, angle, type) {
    var length = this.L;
    if (type == true) { length = this.drawnLen;}

    var anteniAngle = angle - (this.gap * this.spaces) + (this.ID*this.gap);
    endY = y - (length * Math.cos(anteniAngle));
    return endY;
  }

  this.intersects = function(creature, x, y, angle) {
    //dimentions of creature
    circX = creature.x;
    circY = creature.y; 
    //dimentions of line
    startX = x;
    startY = y;
    endX = this.endX(x, angle, false);
    endY = this.endY(y, angle, false);

    return circle(startX, startY, endX, endY, circX, circY, 8)
  }
}


//returns length of line at intersection w. a circle. Or length of line segment if no intersection
function circle(srtX, srtY, endX, endY, circleX, circleY, radius) {

  //default len of antena = 50;

  //return if too far away
  var Hypotenuse = Math.sqrt(Math.pow(srtX - circleX, 2) + Math.pow(srtY - circleY, 2));
  if (Hypotenuse > 50 + radius) {return 50;}

  //slope is vertical rise / horizontal run.
  var hypM = (srtY - circleY) / (srtX - circleX);
  var antM = (endY - srtY) / (endX - srtX);

  //tan of the angle to X = M
  var ang = Math.atan(hypM) - Math.atan(antM);

  //Opposite = sin(θ) * Hypotenuse
  var opposite = Math.sin(ang) * Hypotenuse;

  //is this line shorter than radius?
  var adjac = Math.sqrt(Math.pow(Hypotenuse, 2) - Math.pow(opposite, 2));
  var diff = Math.sqrt(Math.pow(radius, 2) - Math.pow(opposite, 2));

  //catches opposite ghost circle sindrome exeption
  minX = Math.min(srtX, endX); maxX = Math.max(srtX, endX);
  minY = Math.min(srtY, endY); maxY = Math.max(srtY, endY);
   if (!(circleX > minX - radius && circleX < maxX + radius) || !(circleY > minY - radius && circleY < maxY + radius)){
    return 50;
  }

  if (opposite < radius) {
    return adjac - diff;
  }

  else {
    return 50;
  }

}

