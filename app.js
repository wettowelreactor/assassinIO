var express = require('express');
var app = express();
var http = require('http').Server(app);
global.io = require('socket.io')(http);
var GameServer = require('./GameServer.js');
var players = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('New client connected (id=' + socket.id + ').');
  players.push(socket.id);
  io.sockets.connected[socket.id].emit('playerID', socket.id);
  socket.on('disconnect', function(){
    var index = players.indexOf(socket.id);
    if (index != -1) {
        players.splice(index, 1);
        console.info('Client gone (id=' + socket.id + ').');
    }
  });
});

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

http.listen(3000, function(){
  console.log('listening on *:3000');
});

gameServer = new GameServer();
gameServer.initalize();

exports.io = io;
