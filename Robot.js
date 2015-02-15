var Robot = function(){
};

Robot.prototype.moveForward = function(){
  console.log('Moving Forward');
};

Robot.protoype.turnLeft = function(){
  console.log('Turning Left');
};

Robot.prototype.turnRight = function(){
  console.log('Turning Right');
};

Robot.prototype.turnAround = function() {
  console.log('Turning Around');
};

Robot.prototype.move = function() {
  var direction = Math.floor(Math.random() * 10);

  if (direction === 0) {
    this.turnAround();
  } else if (direction === 1) {
    this.turnRight();
  } else if (direction === 2) {
    this.turnLeft();
  } else {
    this.moveForward();
  }
};
