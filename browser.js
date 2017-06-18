var socket = new WebSocket("ws://localhost:8081");
var form = document.querySelector(".js-chat__form");
var input = document.querySelector(".js-chat__input");
var output = document.querySelector(".js-chat__output");

form.addEventListener("click", function(e) {
    e.preventDefault();
    var message = input.value;
    socket.send(message);
});

socket.onmessage = function(event) {
    var message = event.data;
    showMessage(message); 
};

function showMessage(message) {
    var messageElem = document.createElement('p');
    messageElem.innerText = message;
    output.appendChild(messageElem);
}