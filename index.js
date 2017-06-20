var form = document.querySelector(".js-chat__form");
var output = document.querySelector(".js-chat__output");
var input = form.querySelector(".js-chat__input");
var name = form.querySelector(".js-chat__name");
var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);

ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    var li = document.createElement('li');
    li.className = "chat__frame";
    li.innerHTML = data.message + " " + data.name;
    document.querySelector('.js-chat__list').appendChild(li);
    output.scrollTop = output.scrollHeight;
};

form.addEventListener("submit", function(e) {
    e.preventDefault();
    var data = {
        message: input.value,
        name: name || "noname"
    }
    ws.send(JSON.stringify(data));
    input.value = "";
})

var name = prompt("Enter your name : ", "your name");