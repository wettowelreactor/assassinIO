var _ = require('underscore');

var GameServer = function () {
  this.activePlayers = 0;
  this.numberOfRobots = 50;
  this.width = 1280;
  this.height = 640;
  this.spriteSize = 64;
  this.robots = [];
};

GameServer.prototype.rand  = function(n){ return Math.floor( Math.random() * n ); };
GameServer.prototype.randX = function() { 
  var randx = this.rand(this.maxX()) + this.minX();
  var xoffset = randx % this.spriteSize;
  randx -= xoffset;
  return randx; 
};
GameServer.prototype.randY = function() {
  var randy = this.rand(this.maxY()) + this.minY();
  var yoffset = randy % this.spriteSize;
  randy -= yoffset;
  return randy;
};
GameServer.prototype.randDirection = function() {
  var direction = this.rand(5);
  var result;
  if (direction === 0) {
    result = 'Pause';
  } else if (direction === 1) {
    result = 'North';
  } else if (direction === 2) {
    result = 'East';
  } else if (direction === 3) {
    result = 'South';
  } else {
    result = 'West';
  }
  return result;
};
GameServer.prototype.minX = function() { return 0; };
GameServer.prototype.maxX = function() { return this.width - this.spriteSize; };
GameServer.prototype.minY = function() { return 0; };
GameServer.prototype.maxY = function() { return this.height - this.spriteSize; };

GameServer.prototype.initalize = function() {
  this.initRobots();
  setInterval(this.moveRobots.bind(this), 1000);
};

GameServer.prototype.initRobots = function() {
  var direction = this.randDirection();
  this.robots = _.map(_.range(this.numberOfRobots), function(value){
    return {
      id: value,
      x: this.randX(), 
      y: this.randY(), 
      direction: direction
    };
  }.bind(this));
};

GameServer.prototype.moveRobots = function() {
  _.each(this.robots, function(robot, index, robots) {
    robots[index] = this.moveRobot(robot);
  }.bind(this));
  //console.log(this.robots);
  //io.emit(robots)
};

GameServer.prototype.moveRobot = function(robot) {
  this.setRobotDirection(robot);
  console.log(robot);
  if (robot.direction === 'North') {
    if (robot.y - this.spriteSize < this.minY()) {
      this.moveRobot(robot);
    } else {
      robot.y -= this.spriteSize;
    }
  } else if (robot.direction === 'South') {
    if (robot.y + this.spriteSize > this.maxY()) {
      this.moveRobot(robot);
    } else {
      robot.y += this.spriteSize;
    }
  } else if (robot.direction === 'West') {
    if (robot.x - this.spriteSize < this.minX()) {
      this.moveRobot(robot);
    } else {
      robot.x -= this.spriteSize;
    }
  } else if (robot.direction === 'East') {
    if (robot.x + this.spriteSize > this.maxX()) {
      this.moveRobot(robot);
    } else {
      robot.x += this.spriteSize;
    }
  }
  return robot;
};

GameServer.prototype.setRobotDirection = function(robot){
  if (this.rand(2) === 1) {
    robot.direction = this.randDirection();
  }
};

module.exports = GameServer;
