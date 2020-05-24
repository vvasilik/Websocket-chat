const WebSocketServer = require("ws").Server
const http = require("http")
const express = require("express")
const app = express()
const port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))

const server = http.createServer(app)
server.listen(port)

console.log("http server listening on http://localhost:%d", port)

const wss = new WebSocketServer({server: server})
console.log("websocket server created")

const clients = [];
let counter = 0;
wss.on("connection", function(ws) {
    counter++;
    const id = Math.round(Math.random() * 1e+16);
    clients[id] = ws;
    for(let key in clients) {
        const data = {
            message: "You have new connection! Total: " + counter,
            name: "system"
        }
        clients[key].send(JSON.stringify(data));
    }
    console.log("websocket connection open", id)

    ws.on('message', function(data) {
        for(const key in clients) {
            clients[key].send(data);
        }
    })

    ws.on("close", function() {
        counter--;
        delete clients[id];
        const data = {
            message: "Total: " + counter,
            name: "noname"
        }

        for(const key in clients) {
            clients[key].send(JSON.stringify(data));
        }
    })
})
