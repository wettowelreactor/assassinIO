var express = require('express');
var app = express();
var http = require('http').Server(app);
var GameServer = require('./GameServer.js');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

http.listen(3000, function(){
  console.log('listening on *:3000');
});

gameServer = new GameServer();
gameServer.initalize();
