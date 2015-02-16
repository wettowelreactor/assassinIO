var Game = function () {
  this.activePlayers = 0;
  this.numberOfRobots = 1;
  this.spriteSize = 64;
  this.stepSize = 10;
};

Game.prototype.pixelize = function(number) { return number + 'px'; };
Game.prototype.dePixel = function(string) { return string.slice( 0, -2 ); };
Game.prototype.rand  = function(n){ return Math.floor( Math.random() * n ); };
Game.prototype.randX = function() { 
  var randx = this.rand(this.maxX()) + this.minX();
  var xoffset = randx % this.spriteSize;
  randx -= xoffset;
  return this.pixelize(randx); 
};
Game.prototype.randY = function() {
  var randy = this.rand(this.maxY()) + this.minY();
  var yoffset = randy % this.spriteSize;
  randy -= yoffset;
  return this.pixelize(randy);
};
Game.prototype.minX = function() { return 0; };
Game.prototype.maxX = function() { return window.innerWidth - this.spriteSize; };
Game.prototype.minY = function() { return 60; };
Game.prototype.maxY = function() { return window.innerHeight - this.spriteSize -60; };

Game.prototype.initalize = function() {
  game.addRobots();
  game.moveRobots(d3.selectAll('.robot'));
};

Game.prototype.addRobots = function() {
  d3.select('.playArea').selectAll('.robot')
    .data(_.range(this.numberOfRobots))
    .enter()
    .insert('div')
    .classed('robot', true)
    .style({
      top: this.randY.bind(this),
      left: this.randX.bind(this)
    });
};

Game.prototype.moveRobots = function(elements) {
  var context = this;
  elements.each(function(d){
    context.moveRobot.call(context, d3.select(this), d % 5);
  });
};

Game.prototype.getMoveFunc = function(number) {
  if (number === 0) {
    return this.moveRobotNorth;
  } else if (number === 1) {
    return this.moveRobotEast;
  } else if (number === 2) {
    return this.moveRobotSouth;
  } else if (number === 3) {
    return this.moveRobotWest;
  } else {
    return this.moveRobotPause;
  }
};

Game.prototype.moveRobotNorth = function(element) {
  var currentCoords = this.getCurrentCoords(element);
  currentCoords[1] -= this.spriteSize;
  if (currentCoords[1] < this.minY()) {
    var moveFunc = this.getMoveFunc(currentCoords[1] % 5).bind(this);
    return moveFunc(element);
  } else {
    element.attr('class', 'robot robotNorth');
    return currentCoords;
  }
};

Game.prototype.moveRobotEast = function(element) {
  var currentCoords = this.getCurrentCoords(element);
  currentCoords[0] += this.spriteSize;
  if (currentCoords[0] > this.maxX()) {
    var moveFunc = this.getMoveFunc(currentCoords[0] % 5).bind(this);
    return moveFunc(element);
  } else {
    element.attr('class', 'robot robotEast');
    return currentCoords;
  }
};

Game.prototype.moveRobotSouth = function(element) {
  var currentCoords = this.getCurrentCoords(element);
  currentCoords[1] += this.spriteSize;
  if (currentCoords[1] > this.maxY()) {
    var moveFunc = this.getMoveFunc(currentCoords[1] % 5).bind(this);
    return moveFunc(element);
  } else {
    element.attr('class', 'robot robotSouth');
    return currentCoords;
  }
};

Game.prototype.moveRobotWest = function(element) {
  var currentCoords = this.getCurrentCoords(element);
  currentCoords[0] -= this.spriteSize;
  if (currentCoords[0] < this.minX()) {
    var moveFunc = this.getMoveFunc(currentCoords[0] % 5).bind(this);
    return moveFunc(element);
  } else {
    element.attr('class', 'robot robotWest');
    return currentCoords;
  }
};

Game.prototype.moveRobotPause = function(element) {
  element.attr('class', 'robot');
  return this.getCurrentCoords(element);
};

Game.prototype.getCurrentCoords = function(element) {
  var x = +this.dePixel(element.style('left'));
  var y = +this.dePixel(element.style('top'));
  console.log('current', x, y);
  return [x, y];
};

Game.prototype.moveRobot = function(element, bias) {
  var direction = this.rand(10);
  var moveFunc;
  var newCoords;

  direction = direction > 4 ? bias : direction;
  moveFunc = this.getMoveFunc(direction).bind(this);
  newCoords = moveFunc(element);
  console.log('new', newCoords[0], newCoords[1], direction);
  element
    .transition()
    .duration(1000)
    .ease('linear')
    .style({
      top: this.pixelize(newCoords[1]),
      left: this.pixelize(newCoords[0])
    }).each('end', function(){
      this.moveRobot(element, direction);
    }.bind(this));
};
