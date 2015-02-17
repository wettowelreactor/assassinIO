var GameClient = function () {
  this.activePlayers = 0;
  this.width = 1200;
  this.height = 600;
};
GameClient.prototype.pixelize = function(number) { return number + 'px'; };
GameClient.prototype.dePixel = function(string) { return string.slice( 0, -2 ); };

GameClient.prototype.initalize = function() {};
