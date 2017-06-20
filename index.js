var form = document.querySelector(".js-chat__form");
var output = document.querySelector(".js-chat__output");
var input = form.querySelector(".js-chat__input");
var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);

ws.onmessage = function (event) {
    var li = document.createElement('li');
    li.className = "chat__frame";
    li.innerHTML = event.data;
    document.querySelector('.js-chat__list').appendChild(li);
    output.scrollTop = output.scrollHeight;
};

form.addEventListener("submit", function(e) {
    e.preventDefault();
    ws.send(input.value);
    input.value = "";
})