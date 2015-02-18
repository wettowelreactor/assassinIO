var express = require('express');
var app = express();
var http = require('http').Server(app);
global.io = require('socket.io')(http);
var GameServer = require('./GameServer.js');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
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
