var GameClient = function () {
  this.activePlayers = 0;
  this.width = 1280;
  this.height = 640;
};
GameClient.prototype.pixelize = function(number) { return number + 'px'; };
GameClient.prototype.dePixel = function(string) { return string.slice( 0, -2 ); };

GameClient.prototype.initalize = function() {
  d3.selectAll('body').on('keydown', this.keyDown);
  d3.selectAll('body').on('keyup', this.keyUp);
};

GameClient.prototype.keyDown = function() {
  var data = {move: d3.event.keyCode};
  socket.emit('playerKeyDown', data);
};

GameClient.prototype.keyUp = function() {
  var data = {move: d3.event.keyCode};
  socket.emit('playerKeyUp', data);
};

GameClient.prototype.moveRobots = function(moves) {
  var d3Robots = d3.select('.playArea').selectAll('.robot')
    .data(moves, function(d){return d.id;});

  d3Robots.enter()
    .append('div')
    .classed('sprite automated robot', true);

  d3Robots
    .classed('robotNorth', function(d) {return d.direction === 'North';})
    .classed('robotSouth', function(d) {return d.direction === 'South';})
    .classed('robotWest', function(d) {return d.direction === 'West';})
    .classed('robotEast', function(d) {return d.direction === 'East';})
    .transition()
    .duration(500)
    .ease('linear')
    .style({
      top: function(d){return this.pixelize(d.y);}.bind(this),
      left: function(d){return this.pixelize(d.x);}.bind(this)
    });
};
var gameClient = new GameClient();
var socket = io();

socket.on('robotMoves', function(msg) {
  gameClient.moveRobots(msg);
});

socket.on('playerMoves', function(msg) {
  console.log(msg);
});

gameClient.initalize();
