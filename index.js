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


const WebSocket = require('ws');

// clients
var clients = {};

// WebSocket-server 8081
var webSocketServer = new WebSocket("wss://vvasilik-chat.herokuapp.com:3030");
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
