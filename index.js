var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});




// var http = require('http');
// var Static = require('node-static');
// var WebSocketServer = new require('ws');

// // clients
// var clients = {};

// // WebSocket-server 8081
// var webSocketServer = new WebSocketServer.Server({port: 8081});
// webSocketServer.on('connection', function(ws, req) {
//   var id = Math.random();
//   clients[id] = ws;
//   console.log("new connetion " + id);

//   ws.on('message', function(message) {
//     console.log('get message ' + message);

//     for(var key in clients) {
//       clients[key].send(message);
//     }
//   });

//   ws.on('close', function() {
//     console.log('connection closed ' + id);
//     delete clients[id];
//   });

// });


// simple server at 8080
//var fileServer = new Static.Server('.');
//http.createServer(function (req, res) {
  
 // fileServer.serve(req, res);

//}).listen(8080);

//console.log("СServer started at 8080, 8081");

