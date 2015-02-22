var _ = require('underscore');

var GameServer = function () {
  this.activePlayers = 0;
  this.numberOfRobots = 50;
  this.width = 1280;
  this.height = 640;
  this.spriteSize = 64;
  this.robots = [];
  this.players = {};
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
  setInterval(this.gameTick.bind(this), 500);
};

GameServer.prototype.gameTick = function() {
  this.moveRobots();
  console.log(this.players);
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

GameServer.prototype.getPlayerDirection = function(move) {
  if (move === 87) {
    return 'North';
  } else if (move === 83) {
    return 'South';
  } else if (move === 65) {
    return 'West';
  } else if (move === 68) {
    return 'East';
  } else {
    return 'Pause';
  }
};

GameServer.prototype.movePlayer = function() {
  _.each(this.players, function(player, index, players) {
    this.movePlayer(player);
  }.bind(this));
  io.emit('playerMoves', this.players);
};

GameServer.prototype.movePlayer = function(player) {
  if (player.direction === 'North') {
    player.y = Math.max(player.y - this.spriteSize, this.minY());
  } else if (player.direction === 'South') {
    player.y = Math.min(player.y + this.spriteSize, this.maxY());
  } else if (player.direction === 'West') {
    player.x = Math.max(player.x - this.spriteSize, this.minX());
  } else if (player.direction === 'East') {
    player.x = Math.min(player.x + this.spriteSize, this.maxX());
  }
};

GameServer.prototype.moveRobots = function() {
  _.each(this.robots, function(robot, index, robots) {
    this.moveRobot(robot);
  }.bind(this));
  io.emit('robotMoves', this.robots);
};

GameServer.prototype.moveRobot = function(robot) {
  this.setRobotDirection(robot);
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
};

GameServer.prototype.setRobotDirection = function(robot){
  if (this.rand(2) === 1) {
    robot.direction = this.randDirection();
  }
};

GameServer.prototype.addPlayer = function(id) {
  this.players[id] = {
    id: id,
    x: this.randX(), 
    y: this.randY(), 
    direction: 'Pause'
  };
};

GameServer.prototype.removePlayer = function(id) {
  delete this.players[id];
};

GameServer.prototype.addMove = function (id, move, keyDown) {
  if (keyDown && move === 32) {
    this.players[id].attacking = true;
  } else if (!keyDown && move === 32) {
    this.players[id].attacking = false;
  } else if (keyDown) {
    this.players[id].direction = this.getPlayerDirection(move);
  } else {
    this.players[id].direction = "Pause";
  }
};

module.exports = GameServer;
