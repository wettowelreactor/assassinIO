var Robot = function() {
  this.height = 0;
  this.width = 0;
  this.moveBias = this.moveSouth;
};

Robot.prototype.moveNorth = function() {
  console.log('Moving North');
  this.moveBias = this.moveNorth;
};

Robot.prototype.moveWest = function() {
  console.log('Moving West');
  this.moveBias = this.moveWest;
};

Robot.prototype.moveEast = function() {
  console.log('Moving East');
  this.moveBias = this.moveEast;
};

Robot.prototype.moveSouth = function() {
  console.log('moveSouth');
  this.moveBias = this.moveSouth;
};

Robot.prototype.movePause = function() {
  console.log('Pausing');
  this.moveBias = this.movePause;
};

Robot.prototype.move = function() {
  var direction = Math.floor(Math.random() * 10);

  if (direction === 0) {
    this.moveNorth();
  } else if (direction === 1) {
    this.moveEast();
  } else if (direction === 2) {
    this.moveSouth();
  } else if (direction === 3) {
    this.moveWest();
  } else if (direction === 4) {
    this.movePause();
  } else {
    this.moveBias();
  }
};
