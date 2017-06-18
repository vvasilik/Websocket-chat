var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});





var http = require('http');
var Static = require('node-static');
var WebSocketServer = new require('ws');

// clients
var clients = {};

// WebSocket-server 8081
var webSocketServer = new WebSocketServer.Server({port: 8081});
webSocketServer.on('connection', function(ws, req) {
  var id = Math.random();
  clients[id] = ws;
  console.log("new connetion " + id);

  ws.on('message', function(message) {
    console.log('get message ' + message);

    for(var key in clients) {
      clients[key].send(message);
    }
  });

  ws.on('close', function() {
    console.log('connection closed ' + id);
    delete clients[id];
  });

});


// simple server at 8080
//var fileServer = new Static.Server('.');
//http.createServer(function (req, res) {
  
 // fileServer.serve(req, res);

//}).listen(8080);

//console.log("СServer started at 8080, 8081");

