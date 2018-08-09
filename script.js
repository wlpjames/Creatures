

function startGame() {
    simulation.start();
    pack = 8;
    testCreature = [pack];
    for (var i = 0; i < pack; i++) {
      testCreature[i] = new creature(8, "Black", 100 + (i*10), 100 + (i*10), i);
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
        
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function removeCreature(index) {
  testCreature.splice(index, 1);
  pack--;

}

function updateGameArea() {
  simulation.clear();
  for (var i = 0; i < pack; i++) {

    testCreature[i].hunger();

    if (i%4 == 0) {
      if (testCreature[i].lifeCycle <1) {
        testCreature[i].cellDivision();
      }

      if (testCreature[i].Hunger < 1) {
      removeCreature(i);
      }
      else {
        testCreature[i].intArr=testCreature[i].antenaIntersect();
        testCreature[i].creatureIntersect();
        testCreature[i].forwards();
        testCreature[i].rotateC();
        testCreature[i].newPos();
        testCreature[i].update();
      }
    }
    if (i%4 == 1) {
      if (testCreature[i].lifeCycle <1) {
      testCreature[i].cellDivision();
      }
      if (testCreature[i].Hunger < 1) {
        removeCreature(i);
      }
      else {
        testCreature[i].intArr=testCreature[i].antenaIntersect();
        testCreature[i].creatureIntersect();
        testCreature[i].forwards();
        testCreature[i].rotateAC();
        testCreature[i].newPos();
        testCreature[i].update();
      }
    }

    if (i % 4 == 2) {
      if (testCreature[i].lifeCycle <1) {
        testCreature[i].cellDivision();
      }
      if (testCreature[i].Hunger < 1) {
        removeCreature(i);
      }
      else {
        testCreature[i].intArr=testCreature[i].antenaIntersect();
        testCreature[i].creatureIntersect();
        testCreature[i].backwards();
        testCreature[i].rotateAC();
        testCreature[i].newPos();
        testCreature[i].update();
      }
    }


    if (i % 4 == 3) {
      if (testCreature[i].lifeCycle <1) {
        testCreature[i].cellDivision();
      }
      if (testCreature[i].Hunger < 1) {
        removeCreature(i);
      }
      else {
        testCreature[i].intArr=testCreature[i].antenaIntersect();
        testCreature[i].creatureIntersect();
        testCreature[i].backwards();
        testCreature[i].rotateC();
        testCreature[i].newPos();
        testCreature[i].update();
      }

    }
    testCreature[i].bounds();
  }
}



function creature(radius, color, x, y, id) {

  this.R = radius;
  this.speed = 1;
  this.angle = 0;
  this.moveAngle = 0;
  this.x = x
  this.y = y; 
  this.ID =  id;
  this.antenaLen = 70;
  this.isColiding = false;
  
  this.Mass = 20;
  this.Hunger = 20; //what is the function speed of thing

  this.lifeCycle = 1000;


  const anteniNum = 11;
  var anteni = new Array();
  for (var i = 0; i < anteniNum; i++) {
    anteni.push(new antena(i, this.antenaLen, anteniNum, 0.2));
  }

  intArr = [anteniNum];

  this.update = function() {
      ctx = simulation.context;
      ctx.fillStyle = color;
      
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.R,0,2*Math.PI);
      ctx.strokeStyle = "Black";
      ctx.stroke();   

      if (this.isColiding == true) {
        ctx.fillStyle = '#000000';
        ctx.fill();
      }

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

  this.bounds = function() {
  //would be better if could detect bounds
    var size = window.innerHeight / 1.5;
    if (this.x < this.R) {
      this.x = this.R;
    }
    if(this.x > size - this.R){
      this.x = size - this.R;
    }
    if(this.y < this.R) {
      this.y = this.R;
    }
    if(this.y > size - this.R) {
      this.y = size - this.R;
    }
  }



  this.drawAntena = function() {
      
    for (var i = 0; i < anteniNum; i++) { 
        
      anteni[i].drawnLen = intArr[i];
      var thing = simulation.context;
      thing.beginPath();
      thing.moveTo(this.x,this.y);
      thing.lineTo(anteni[i].endX(this.x, this.angle, true), anteni[i].endY(this.y, this.angle, true));
      if (intArr[i] < this.antenaLen) {
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
      
      intArr[i] = this.antenaLen; 
      
      for (var j = 0; j < pack; j++) {
        var curr = this.antenaLen;
        //if antena[i] intersects creature[j] intersectArr = true;
        if (j != testCreature.indexOf(this)) {
          curr = anteni[i].intersects(testCreature[j], this.x, this.y, this.angle);
          if (curr < intArr[i]) {
            intArr[i] = curr;
          }
        }
      }
    }
  }

  this.creatureIntersect = function() {
    this.isColiding = false;
    for (var i = 0; i < pack; i++) {
      if (i != testCreature.indexOf(this) && twoCircles(testCreature[testCreature.indexOf(this)], testCreature[i]) == true)
      {
        this.isColiding = true;
        this.eat(i);
      }
    }
  }

  this.eat = function(j) {
    if (this.Mass >= testCreature[j].Mass) {
      this.Hunger+=0.03;
      testCreature[j].Hunger-=0.05;
    }
    else {
      testCreature[j].Hunger-=0.05;
      this.Hunger+= 0.03;
    }
  }

  this.hunger = function() {
    if (this.isColiding == false) {
      this.Hunger-= 0.01;
      this.lifeCycle -= 1;
    }
  }

  this.cellDivision = function() {
    //if cell has been alive long enough then can have an offspring. popped onto the array
    testCreature.push(new creature(8, "Black", this.x, this.y, 0));
    pack++;
    this.lifeCycle = 1000;
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

    return circle(startX, startY, endX, endY, circX, circY, creature.R, this.length)
  }
}


//returns length of line at intersection w. a circle. Or length of line segment if no intersection
function circle(srtX, srtY, endX, endY, circleX, circleY, radius, antenaLen) {

  //default len of antena = 50;

  //return if too far away
  var Hypotenuse = Math.sqrt(Math.pow(srtX - circleX, 2) + Math.pow(srtY - circleY, 2));
  //if (Hypotenuse > antenaLen + radius) {return antenaLen;}

  //slope is vertical rise / horizontal run.
  var hypM = (srtY - circleY) / (srtX - circleX);
  var antM = (endY - srtY) / (endX - srtX);

  //tan of the angle to X = M
  var ang = Math.atan(hypM) - Math.atan(antM);

  //Opposite = sin(θ) * Hypotenuse
  var opposite = Math.sin(ang) * Hypotenuse;

  //adjac is length of line srt to center of instersection/ notintersection
  //diff is the distance from adjac to the edge of the cicle
  var adjac = Math.sqrt(Math.pow(Hypotenuse, 2) - Math.pow(opposite, 2));
  var diff = Math.sqrt(Math.pow(radius, 2) - Math.pow(opposite, 2));

  //catches opposite ghost circle sindrome exeption, checks if intersection is within segment
  minX = Math.min(srtX, endX); maxX = Math.max(srtX, endX);
  minY = Math.min(srtY, endY); maxY = Math.max(srtY, endY);
   if (!(circleX > minX - radius && circleX < maxX + radius) || !(circleY > minY - radius && circleY < maxY + radius)){
    return antenaLen;
  }

  //if oposite > radius then intersection occurs
  if (opposite < radius) {
    //returns 
    return adjac - diff;
  }

  else {
    return antenaLen;
  }

}

function twoCircles(creature1, creature2) {

  var distance = Math.sqrt(Math.pow(creature1.x - creature2.x, 2) + Math.pow(creature1.y - creature2.y, 2));
  if (distance < creature1.R + creature2.R - 3) {
    return true;
  }
  else {
    return false;
  }
}

/*function brain() { //pass some sort of json object

  this.inputs = 0;
  this.outputs = 0;

  this.inputArr = [inputs]
  var outputArr = [outputNum];
  
  this.layers = 0;
  this.layerLen = 0;

  this.nodes = [layers+2][LayerLen];

  this.weights = [layers+1][LayerLen][layerLen];

  //load weight values and structure here

  this.calculate = function() {
    for (var i = 1; i< layers+1; i++) {
      for (var j = 0; j < LayerLen) {
        for (var k = 0; k < LayerLen; k++) {

          nodes[i][j] += nodes[i-1][k] * weights[i][j][k]
        }
      }
    }
    outputArr = nodes[layers+1];
    return outputArr;
  }
}*/