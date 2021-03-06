var express = require('express');
var app = express();
var http = require('http').Server(app);
global.io = require('socket.io')(http);
var GameServer = require('./GameServer.js');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

io.on('connection', function(socket){
  console.log('New client connected (id=' + socket.id + ').');
  gameServer.addPlayer(socket.id);
  socket.on('disconnect', function(){
    gameServer.removePlayer(socket.id);
    console.info('Client gone (id=' + socket.id + ').');
  });
  socket.on('playerKeyDown', function(msg){
    gameServer.addMove(socket.id, msg.move, true);
  });
  socket.on('playerKeyUp', function(msg){
    gameServer.addMove(socket.id, msg.move, false);
  });
});

var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on', port);
});

gameServer = new GameServer();
gameServer.initalize();

exports.io = io;
