var GameClient = function () {
  this.activePlayers = 0;
  this.width = 1280;
  this.height = 640;
  this.dwelltime = 4000;
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

GameClient.prototype.getCardinalClass = function(root, direction) {
  if (direction === 'Pause') {
    return root;
  } else {
    return root += ' ' + root + direction;
  }
};

GameClient.prototype.getMoveClass = function(d) {
  var moveClass;
  if (d.attacking) {
    return this.getCardinalClass('attack', d.direction);
  } else if (Date.now() - d.revealed < this.dwelltime) {
    return this.getCardinalClass('revealed', d.direction);
  } else if (Date.now() - d.dead < this.dwelltime) {
    if (d.id !== socket.id) {
      return 'invisible';
    } else {
      return this.getCardinalClass('hidden', d.direction)
    }
  } else if (d.id !== socket.id) {
    return this.getCardinalClass('robot', d.direction);
  } else {
    return this.getCardinalClass('player', d.direction);
  }
};

GameClient.prototype.moveRobots = function(moves) {
  var d3Robots = d3.select('.playArea').selectAll('.npc')
    .data(moves, function(d){return d.id;});

  this.move(d3Robots, 'npc');
};

GameClient.prototype.movePlayers = function(moves) {
  var d3Players = d3.select('.playArea').selectAll('.pc')
    .data(moves, function(d){return d.id;});
  this.move(d3Players, 'pc');
  d3Players.exit().remove();
}

GameClient.prototype.move = function(selector, charType) {
  var classBase = 'sprite '+ charType;
  selector.enter()
    .append('div')
    .classed(classBase, true);

  selector
    .attr('class', function(d) {
      return classBase + ' ' + this.getMoveClass(d);}.bind(this)
    ).transition()
    .duration(490)
    .ease('linear')
    .style({
      top: function(d){return this.pixelize(d.y);}.bind(this),
      left: function(d){return this.pixelize(d.x);}.bind(this)
    });
};

GameClient.prototype.updateCount = function(count, classSelector) {
  d3.select(classSelector).text(count);
};

var gameClient = new GameClient();
var socket = io();

socket.on('robotMoves', function(msg) {
  gameClient.moveRobots(msg);
});

socket.on('playerMoves', function(msg) {
  var playersArray = _.map(msg, _.identity)
  gameClient.movePlayers(playersArray);
  gameClient.updateCount(playersArray.length, '.playerCount');
  gameClient.updateCount(msg[socket.id].deaths || 0, '.deathCount');
  gameClient.updateCount(msg[socket.id].kills || 0, '.killCount');
});

gameClient.initalize();
