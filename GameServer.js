var GameClient = function () {
  this.activePlayers = 0;
  this.numberOfRobots = 50;
  this.width = 1200;
  this.height = 600;
  this.spriteSize = 64;
  this.robots = [];
};

GameServer.prototype.rand  = function(n){ return Math.floor( Math.random() * n ); };
GameServer.prototype.randX = function() { 
  var randx = this.rand(this.maxX()) + this.minX();
  var xoffset = randx % this.spriteSize;
  randx -= xoffset;
  return this.pixelize(randx); 
};
GameServer.prototype.randY = function() {
  var randy = this.rand(this.maxY()) + this.minY();
  var yoffset = randy % this.spriteSize;
  randy -= yoffset;
  return this.pixelize(randy);
};
GameServer.prototype.randDirection = function() {
  var direction = this.rand(5);
  if (direction === 0) {
    return 'Pause';
  } else if (direction === 1) {
    return 'North';
  } else if (direction === 2) {
    return 'East';
  } else if (direction === 3) {
    return 'South';
  } else {
    return 'West';
  }
};
GameServer.prototype.minX = function() { return 0; };
GameServer.prototype.maxX = function() { return this.width - this.spriteSize; };
GameServer.prototype.minY = function() { return 0; };
GameServer.prototype.maxY = function() { return this.height - this.spriteSize; };

GameServer.prototype.initalize = function() {
  this.initRobots();
  this.moveRobots();
};

GameServer.prototype.initRobots = function() {
  var direction = this.randDirection();
  this.robots = _.map(_.range(this.numberOfRobots), function(){
    return {
      x: this.randX(), 
      y: this.randY(), 
      direction: direction
    };
  });
};

GameServer.prototype.moveRobots = function() {
  _.each(this.robots, function(robot, index, robots) {
    robots[i] = this.moveRobot(robot);
  });
  //io.emit(robots)
};

GameServer.prototype.moveRobot = function(robot) {
  this.setRobotDirection(robot);
  if (robot.direction === 'N') {
    if (robot.y - this.spriteSize < this.minY) {
      this.moveRobot(robot);
    } else {
      robot.y -= this.spriteSize;
    }
  } else if (robot.direction === 'S') {
    if (robot.y + this.spriteSize < this.maxY) {
      this.moveRobot(robot);
    } else {
      robot.y += this.spriteSize;
    }
  } else if (robot.direction === 'W') {
    if (robot.x - this.spriteSize < this.minX) {
      this.moveRobot(robot);
    } else {
      robot.x -= this.spriteSize;
    }
  } else if (robot.direction === 'E') {
    if (robot.x + this.spriteSize < this.maxX) {
      this.moveRobot(robot);
    } else {
      robot.x += this.spriteSize;
    }
  }
  return robot;
};

GameServer.prototype.setRobotDirection = function(robot){
  if (this.rand(10) < 5) {
    robot.direction = this.randDirection();
  }
};
