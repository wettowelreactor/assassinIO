var GameClient = function () {
  this.activePlayers = 0;
  this.width = 1280;
  this.height = 640;
};
GameClient.prototype.pixelize = function(number) { return number + 'px'; };
GameClient.prototype.dePixel = function(string) { return string.slice( 0, -2 ); };

GameClient.prototype.initalize = function() {};


GameClient.prototype.moveRobots = function(moves) {
  console.log("move robots");
  var d3Robots = d3.select('.playArea').selectAll('.robot')
    .data(moves, function(d){return d.id;});

  d3Robots.enter()
    .append('div')
    .classed('robot', true);

  d3Robots
    .attr('class', function(d) {
      var roboclass = 'robot';
      if (d.direction === "North") { roboclass += ' robotNorth'; }
      if (d.direction === "South") { roboclass += ' robotSouth'; }
      if (d.direction === "East") { roboclass += ' robotEast'; }
      if (d.direction === "West") { roboclass += ' robotWest'; }
      return roboclass;
    }).transition()
    .duration(1000)
    .ease('linear')
    .style({
      top: function(d){return this.pixelize(d.y);}.bind(this),
      left: function(d){return this.pixelize(d.x);}.bind(this)
    });
};

gameClient = new GameClient();
var socket = io();
socket.on('robotMoves', function(msg) {
  console.log('moves received');
  gameClient.moveRobots(msg);
});
