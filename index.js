var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.render('public/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



var http = require('http');
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

var WebSocketServer = new require('ws');

// clients
var clients = {};

// WebSocket-server 8081
var webSocketServer = new WebSocketServer.Server({
    httpServer: server
});
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
