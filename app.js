var options = {
  numberOfRobots: 10,
  spriteSize: 64
};

var pixelize = function(number) { return number + 'px'; };
var dePixel = function(string) { return string.slice( 0, -2 ); };
var rand  = function(n){ return Math.floor( Math.random() * n ); };
var randX = function() { 
  return pixelize( rand( maxX() ) + minX() ); 
};
var randY = function() { 
  return pixelize( rand( maxY() ) + minY() ); 
};
var minX = function() { return 0; };
var maxX = function() { return window.innerWidth - options.spriteSize; };
var minY = function() { return 60; };
var maxY = function() { return window.innerHeight - options.spriteSize; };

var addRobots = function() {
  d3.select('.playArea').selectAll('.robot')
    .data(_.range(options.numberOfRobots))
    .enter()
    .insert('div')
    .classed('robot robotSouth', true)
    .style({
      top: randY,
      left: randX
    });
};

addRobots();
